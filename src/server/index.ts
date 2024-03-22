import express from 'express';
import next from 'next';
import schedule from 'node-schedule';
import { webPush } from '@/lib/webPush';
import { prisma } from '@/lib/prismadb';
import { getHours, getMinutes, format } from 'date-fns';
import { isIntakeDate } from '@/utils/isIntakeDate';
import { getImageUrlByIdServer } from '@/app/api/lib/cloudinary';
import { getCurrentDateIntakeTimes } from '@/utils/getCurrentDateIntakeTimes';
import { DayOfWeek } from '@prisma/client';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
  try {
    await app.prepare();
    const server = express();

    schedule.scheduleJob('* * * * *', async () => {
      const currentDate = new Date();
      const currentHours = getHours(currentDate);
      const currentMinutes = getMinutes(currentDate);
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      const completedOrSkippedMedicineRecords = await prisma.medicineRecord.findMany({
        where: {
          OR: [{ isCompleted: true }, { isSkipped: true }],
          scheduledIntakeTime: currentTimeInMinutes,
        },
        select: {
          medicineId: true,
        },
      });
      const completedOrSkippedMedicineIds = completedOrSkippedMedicineRecords.map(
        (m) => m.medicineId,
      );

      const meds = await prisma.medicine.findMany({
        where: {
          NOT: {
            id: {
              in: completedOrSkippedMedicineIds,
            },
          },
          notify: true,
          OR: [
            {
              intakeTimes: {
                some: {
                  time: currentTimeInMinutes,
                },
              },
            },
            {
              frequency: {
                everyday: {
                  weekendIntakeTimes: {
                    some: {
                      time: currentTimeInMinutes,
                    },
                  },
                },
              },
            },
          ],
        },
        include: {
          intakeTimes: true,
          frequency: {
            include: {
              everyday: {
                include: {
                  weekendIntakeTimes: true,
                },
              },
              oddEvenDay: true,
              onOffDays: true,
            },
          },
          period: true,
          memo: true,
          stock: true,
        },
      });

      const currentMedicines = meds.filter((m) => {
        const { frequency, period } = m;
        if (!(frequency && period?.startDate)) return false;

        if (frequency.type === 'EVERYDAY' && frequency.everyday?.weekends?.length && frequency.everyday?.weekendIntakeTimes?.length) {
          const { weekends, weekendIntakeTimes } = frequency.everyday;
          const dayOfWeek = format(currentDate, 'EEEE').toUpperCase() as DayOfWeek;

          if (weekends.includes(dayOfWeek)) {
            if (weekendIntakeTimes.some((t) => t.time === currentTimeInMinutes)) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }

        return isIntakeDate({ frequency, currentDate, startDate: period?.startDate });
      });

      const medicinesToUpdate = currentMedicines
        .map((m) => {
          const stockQuantity = m.stock?.quantity;
          const dosage = getCurrentDateIntakeTimes({ medicine: m, currentDate })?.find(
            (i) => i.time === currentTimeInMinutes,
          )?.dosage;
          return {
            ...m,
            stockQuantity: stockQuantity ? stockQuantity : NaN,
            dosage: dosage ? dosage : NaN,
          };
        })
        .filter(
          (m) =>
            m.stock?.autoConsume &&
            m.stockQuantity &&
            m.dosage &&
            m.stockQuantity >= m.dosage,
        );

      await prisma.$transaction(
        medicinesToUpdate.map((medicine) =>
          prisma.medicine.update({
            where: {
              id: medicine.id,
            },
            data: {
              stock: {
                update: {
                  quantity: Math.max(0, medicine.stockQuantity - medicine.dosage),
                },
              },
            },
          }),
        ),
      );

      const userMedicines = new Map<
        string,
        {
          name: string;
          imageUrl?: string;
        }[]
      >();
      for (const medicine of currentMedicines) {
        const userId = medicine.userId;
        const medicineName = medicine.name;
        const imageId = medicine?.memo?.imageId;
        let imageUrl: string | undefined;

        if (!userMedicines.has(userId)) {
          userMedicines.set(userId, []);
        }

        const userMedicineList = userMedicines.get(userId);
        const userHasMedicineWithImage = userMedicineList?.some((m) => m.imageUrl);

        if (imageId && !userHasMedicineWithImage) {
          const imgUrl = await getImageUrlByIdServer(imageId);
          if (imgUrl) imageUrl = imgUrl;
        }

        userMedicines.get(userId)?.push({ imageUrl, name: medicineName });
      }

      for (const [userId, medicines] of userMedicines) {
        const pushSubscriptions = await prisma.pushSubscription.findMany({
          where: {
            userId,
          },
        });

        const formattedCurrentDate = format(currentDate, 'M月dd日 H:mm');
        if (!pushSubscriptions || pushSubscriptions.length === 0) continue;

        for (const subscription of pushSubscriptions) {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.authKey,
              p256dh: subscription.p256dhkey,
            },
          };

          const payload = JSON.stringify({
            body: `${medicines.map((m) => m.name).join(' ')} ${formattedCurrentDate}`,
            image: medicines.find((m) => m.imageUrl)?.imageUrl,
          });

          await webPush.sendNotification(pushSubscription, payload);
        }
      }
    });

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.info(`Listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
