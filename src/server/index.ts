import express from 'express';
import next from 'next';
import schedule from 'node-schedule';
import { PrismaClient } from '@prisma/client';
import webPush from 'web-push';
import { getHours, getMinutes, format } from 'date-fns';
import { v2 as cloudinary } from 'cloudinary';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient({ log: ['query'] });
webPush.setVapidDetails(
  'mailto:hoge@hoge.hoge',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC!,
  process.env.VAPID_PRIVATE!,
);
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
  secure: true,
});

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
      const currentMedicines = await prisma.medicine.findMany({
        where: {
          NOT: {
            id: {
              in: completedOrSkippedMedicineIds,
            },
          },
          notify: true,
          intakeTimes: {
            some: {
              time: currentTimeInMinutes,
            },
          },
        },
        include: {
          intakeTimes: true,
          memo: true,
        },
      });

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
          const image = await cloudinary.api.resource(imageId);
          const imgUrl = image.secure_url;
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

          webPush.sendNotification(pushSubscription, payload);
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
