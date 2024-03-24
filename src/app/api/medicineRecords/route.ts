import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';
import { medicineRecordFormSchema } from '@/types/zodSchemas/medicineRecordForm/schema';
import { isInvalidDate } from '@/utils/isInvalidDate';
import { Prisma } from '@prisma/client';
import { isDate } from 'date-fns';

import { isInValidIntakeTime } from './utils';

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 });
  }

  try {
    const medicineUnits = await prisma.medicineRecord.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return Response.json(medicineUnits);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify('Internal Server Error'), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 });
  }

  try {
    const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

    const {
      scheduledIntakeDate,
      scheduledIntakeTime,
      actualIntakeTime,
      actualIntakeDate: aIDate,
      medicines: meds,
      isCompleted,
      isSkipped,
      isIntakeTimeScheduled,
    } = await req.json();

    const validation = medicineRecordFormSchema.safeParse({
      intakeDate: aIDate,
      medicines: meds,
    });

    if (!validation.success) {
      return Response.json(validation.error.errors, {
        status: 400,
      });
    }

    if (!isBoolean(isIntakeTimeScheduled)) {
      return new Response(JSON.stringify('Invalid isIntakeTimeScheduled'), { status: 400 });
    }

    if (isIntakeTimeScheduled) {
      if (isInValidIntakeTime(scheduledIntakeTime)) {
        return new Response(JSON.stringify('Invalid scheduledIntakeTime'), { status: 400 });
      }

      const scheduledIntakeDateObj = new Date(scheduledIntakeDate);
      if (!isDate(scheduledIntakeDateObj) || isInvalidDate(scheduledIntakeDateObj)) {
        return new Response(JSON.stringify('Invalid scheduledIntakeDate'), { status: 400 });
      }

      if (!(isBoolean(isCompleted) && isBoolean(isSkipped))) {
        return new Response(JSON.stringify('Invalid medicine status'), { status: 400 });
      }

      if ((isCompleted && isSkipped) || !(isCompleted || isSkipped)) {
        return new Response(JSON.stringify('Invalid medicine status'), { status: 400 });
      }
    } else {
      if (!isBoolean(isCompleted)) {
        return new Response(JSON.stringify('Invalid isCompleted'), { status: 400 });
      }

      if (!isCompleted) {
        return new Response(JSON.stringify('Invalid isCompleted'), { status: 400 });
      }
    }

    if (isInValidIntakeTime(actualIntakeTime)) {
      return new Response('Invalid actualIntakeTime', { status: 400 });
    }

    const { intakeDate: actualIntakeDate, medicines } = validation.data;

    const completedOrSkippedMedicines = await prisma.medicine.findMany({
      where: {
        id: {
          in: medicines.map((m) => m.medicineId),
        },
        stock: {
          autoConsume: false,
        },
      },
      include: {
        stock: true,
      },
    });
    const medicinesToUpdate = completedOrSkippedMedicines
      .map((medicine) => {
        const relatedMedicine = medicines.find((m) => m.medicineId === medicine.id);
        const stockQuantity = medicine.stock?.quantity;
        const dosage = relatedMedicine?.dosage;
        return {
          ...medicine,
          stockQuantity: stockQuantity ? Number(stockQuantity) : NaN,
          dosage: dosage ? Number(dosage) : NaN,
        };
      })
      .filter((m) => m.stockQuantity && m.dosage && m.stockQuantity >= m.dosage);

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

    const commonData = {
      userId: currentUser.id,
      actualIntakeDate,
      actualIntakeTime,
      isCompleted,
    };
    const data = medicines
      .filter((m) => m.isSelected)
      .map((medicine): Prisma.MedicineRecordCreateManyInput => {
        const dosage = Number(medicine.dosage);
        const medicineId = medicine.medicineId;

        if (isIntakeTimeScheduled) {
          return {
            scheduledIntakeDate,
            scheduledIntakeTime,
            dosage,
            medicineId,
            isSkipped,
            ...commonData,
          };
        } else {
          return {
            dosage,
            medicineId,
            ...commonData,
          };
        }
      });

    const addedMedRecords = await prisma.medicineRecord.createMany({
      data,
    });

    return Response.json(addedMedRecords);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify('Internal Server Error'), {
      status: 500,
    });
  }
}
