import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';
import { medicineRecordFormSchema } from '@/types/zodSchemas/medicineRecord/schema';
import { isInvalidDate } from '@/utils/isInvalidDate';
import { Prisma } from '@prisma/client';
import { isDate } from 'date-fns';
import { NextResponse } from 'next/server';
import { isInValidIntakeTime } from './utils';

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const medicineUnits = await prisma.medicineRecord.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return NextResponse.json(medicineUnits);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error: Failed to process the request', {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
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
      return NextResponse.json(validation.error.errors, {
        status: 400,
      });
    }

    if (!isBoolean(isIntakeTimeScheduled)) {
      return new NextResponse('Invalid isIntakeTimeScheduled', { status: 400 });
    }

    if (isIntakeTimeScheduled) {
      if (isInValidIntakeTime(scheduledIntakeTime)) {
        return new NextResponse('Invalid scheduledIntakeTime', { status: 400 });
      }

      const scheduledIntakeDateObj = new Date(scheduledIntakeDate);
      if (!isDate(scheduledIntakeDateObj) || isInvalidDate(scheduledIntakeDateObj)) {
        return new NextResponse('Invalid scheduledIntakeDate', { status: 400 });
      }

      if (!(isBoolean(isCompleted) && isBoolean(isSkipped))) {
        return new NextResponse('Invalid medicine status', { status: 400 });
      }

      if ((isCompleted && isSkipped) || !(isCompleted || isSkipped)) {
        return new NextResponse('Invalid medicine status', { status: 400 });
      }
    } else {
      if (!isBoolean(isCompleted)) {
        return new NextResponse('Invalid isCompleted', { status: 400 });
      }

      if (!isCompleted) {
        return new NextResponse('Invalid isCompleted', { status: 400 });
      }
    }

    if (isInValidIntakeTime(actualIntakeTime)) {
      return new NextResponse('Invalid actualIntakeTime', { status: 400 });
    }

    const { intakeDate: actualIntakeDate, medicines } = validation.data;

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

    return NextResponse.json(addedMedRecords);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error: Failed to process the request', {
      status: 500,
    });
  }
}
