import getCurrentUser from '@/app/actions/getCurrentUser';
import getMedicineUnits from '@/app/actions/getMedicineUnits';
import { prisma } from '@/lib/prismadb';
import { medicineUnitFormSchema } from '@/types/zodSchemas/medicineForm/schema';
import { MedicineUnit } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const medicineUnits = await prisma.medicineUnit.findMany({
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
    const currentUnits = await getMedicineUnits();
    const uniqueCurrentUnits = [...new Set(currentUnits.map((u) => u.unit))];
    const body = await req.json();
    const validation = medicineUnitFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, {
        status: 400,
      });
    }

    const { units: newUnits } = validation.data;

    newUnits.filter(
      (unit) => !uniqueCurrentUnits.includes(unit.unit),
    );

    const data = newUnits.map((unit) => ({
      unit: unit.unit,
      userId: currentUser.id,
    }));
    const addedMedUnits = await prisma.medicineUnit.createMany({
      data,
    });

    return NextResponse.json(addedMedUnits);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error: Failed to process the request', {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const medUnitsToDelete: MedicineUnit[] = await req.json();
    const idsToDelete = medUnitsToDelete.map((u) => u.id);

    const currentUnits = await getMedicineUnits();

    if (currentUnits.length <= idsToDelete.length) {
      return new NextResponse('Cannot delete all units. At least one unit must remain.', {
        status: 400,
      });
    }

    await prisma.medicineUnit.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error: Failed to process the request', {
      status: 500,
    });
  }
}
