import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prismadb";
import { isInvalidDate } from "@/utils/isInvalidDate";
import { isDate } from "date-fns";
import { NextResponse } from "next/server";
import { isInValidIntakeTime } from "../utils";

type Params = { params: { medicineRecordId: string } };

export async function DELETE(req: Request, { params }: Params) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
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
      return new NextResponse('Invalid Medicine Record ID', { status: 400 });
    }

    const deletedMedicineRecord = await prisma.medicineRecord.deleteMany({
      where: {
        id: numMedicineRecordId,
      },
    });

    return NextResponse.json(deletedMedicineRecord);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error: Failed to process the request', {
      status: 500,
    });
  }
}


export async function PUT(req: Request, { params }: Params) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
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
      return new NextResponse('Invalid Medicine Record ID', { status: 400 });
    }

    const isValidDosage = (dosage: unknown) => {
      if (typeof dosage !== 'string' || !dosage || Number.isNaN(dosage)) return false;
      const numDosage = Number(dosage);
      if (numDosage <= 0) return false;
      if (numDosage > 1000) return false;
      if (dosage.split('.')[1]?.length > 2) return false;
      return true;
    }

    const {
      actualIntakeTime,
      actualIntakeDate,
      dosage,
    } = await req.json();

    if (isInValidIntakeTime(actualIntakeTime)) {
      return new NextResponse('Invalid actualIntakeTime', { status: 400 });
    }

    const actualIntakeDateObj = new Date(actualIntakeDate);
    if (!isDate(actualIntakeDateObj) || isInvalidDate(actualIntakeDateObj)) {
      return new NextResponse('Invalid actualIntakeDate', { status: 400 });
    }

    if (!isValidDosage(dosage)) {
      return new NextResponse('Invalid dosage', { status: 400 });
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

    return NextResponse.json(addedMedRecords);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error: Failed to process the request', {
      status: 500,
    });
  }
}
