import getCurrentUser from '@/app/actions/getCurrentUser';
import getMedicineUnits from '@/app/actions/getMedicineUnits';
import { prisma } from '@/lib/prismadb';
import { medicineUnitFormSchema } from '@/types/zodSchemas/medicineForm/schema';
import { MedicineUnit, Prisma } from '@prisma/client';

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 });
  }

  try {
    const medicineUnits = await prisma.medicineUnit.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return Response.json(medicineUnits);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify('Internal Server Error: Failed to process the request'), {
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
    const currentUnits = await getMedicineUnits();
    const uniqueCurrentUnits = [...new Set(currentUnits.map((u) => u.unit))];
    const body = await req.json();
    const validation = medicineUnitFormSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(validation.error.errors, {
        status: 400,
      });
    }

    const { units: newUnits } = validation.data;

    newUnits.filter((unit) => !uniqueCurrentUnits.includes(unit.unit));

    const data = newUnits.map(
      (unit): Prisma.MedicineUnitCreateManyInput => ({
        unit: unit.unit,
        userId: currentUser.id,
      }),
    );
    const addedMedUnits = await prisma.medicineUnit.createMany({
      data,
    });

    return Response.json(addedMedUnits);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify('Internal Server Error: Failed to process the request'), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 });
  }

  try {
    const medUnitsToDelete: MedicineUnit[] = await req.json();
    const idsToDelete = medUnitsToDelete.map((u) => u.id);

    const currentUnits = await getMedicineUnits();

    if (currentUnits.length <= idsToDelete.length) {
      return new Response(JSON.stringify('Cannot delete all units. At least one unit must remain.'), {
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

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify('Internal Server Error: Failed to process the request'), {
      status: 500,
    });
  }
}
