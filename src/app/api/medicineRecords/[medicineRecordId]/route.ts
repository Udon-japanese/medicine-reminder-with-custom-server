import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';
import { isInvalidDate } from '@/utils/isInvalidDate';
import { isDate } from 'date-fns';

import { isInValidIntakeTime } from '../utils';

type Params = { params: { medicineRecordId: string } };

export async function DELETE(req: Request, { params }: Params) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 });
  }

  try {
    const { medicineRecordId } = params;
    const numMedicineRecordId = parseInt(medicineRecordId, 10);

    const existingMedicineRecord = await prisma.medicineRecord.findUnique({
      where: {
        id: numMedicineRecordId,
      },
    });

    if (!existingMedicineRecord) {
      return new Response(JSON.stringify('Invalid Medicine Record ID'), { status: 400 });
    }

    const medicineToUpdate = await prisma.medicine.findUnique({
      where: {
        id: existingMedicineRecord.medicineId,
        stock: {
          autoConsume: false,
        },
      },
      include: {
        stock: true,
      },
    });

    const currentQuantity = medicineToUpdate?.stock?.quantity;
    const dosage = existingMedicineRecord.dosage;

    if (currentQuantity && dosage) {
      await prisma.medicine.update({
        where: {
          id: medicineToUpdate?.id,
        },
        data: {
          stock: {
            update: {
              quantity: currentQuantity + dosage,
            },
          },
        },
      });
    }

    const deletedMedicineRecord = await prisma.medicineRecord.deleteMany({
      where: {
        id: numMedicineRecordId,
      },
    });

    return Response.json(deletedMedicineRecord);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify('Internal Server Error'), {
      status: 500,
    });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 });
  }

  try {
    const { medicineRecordId } = params;
    const numMedicineRecordId = parseInt(medicineRecordId, 10);

    const existingMedicineRecord = await prisma.medicineRecord.findUnique({
      where: {
        id: numMedicineRecordId,
      },
    });

    if (!existingMedicineRecord) {
      return new Response(JSON.stringify('Invalid Medicine Record ID'), { status: 400 });
    }

    const isValidDosage = (dosage: unknown) => {
      if (typeof dosage !== 'string' || !dosage || Number.isNaN(dosage)) return false;
      const numDosage = Number(dosage);
      if (numDosage <= 0) return false;
      if (numDosage > 1000) return false;
      if (dosage.split('.')[1]?.length > 2) return false;
      return true;
    };

    const { actualIntakeTime, actualIntakeDate, dosage } = await req.json();

    if (isInValidIntakeTime(actualIntakeTime)) {
      return new Response(JSON.stringify('Invalid actualIntakeTime'), { status: 400 });
    }

    const actualIntakeDateObj = new Date(actualIntakeDate);
    if (!isDate(actualIntakeDateObj) || isInvalidDate(actualIntakeDateObj)) {
      return new Response(JSON.stringify('Invalid actualIntakeDate'), { status: 400 });
    }

    if (!isValidDosage(dosage)) {
      return new Response(JSON.stringify('Invalid dosage'), { status: 400 });
    }

    const addedMedRecords = await prisma.medicineRecord.update({
      data: {
        actualIntakeTime,
        actualIntakeDate: actualIntakeDateObj,
        dosage: Number(dosage),
      },
      where: {
        id: numMedicineRecordId,
      },
    });

    const medicineToUpdate = await prisma.medicine.findUnique({
      where: {
        id: existingMedicineRecord.medicineId,
        stock: {
          autoConsume: false,
        },
      },
      include: {
        stock: true,
      },
    });

    const currentQuantity = medicineToUpdate?.stock?.quantity;
    const prevDosage = existingMedicineRecord.dosage;
    const newDosage = Number(dosage);

    if (currentQuantity && prevDosage && newDosage) {
      await prisma.medicine.update({
        where: {
          id: medicineToUpdate?.id,
        },
        data: {
          stock: {
            update: {
              quantity: Math.max(0, currentQuantity + prevDosage - newDosage),
            },
          },
        },
      });
    }

    return Response.json(addedMedRecords);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify('Internal Server Error'), {
      status: 500,
    });
  }
}
