import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';

export async function PUT(req: Request, { params }: { params: { medicineId: string } }) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 });
  }

  try {
    const { medicineId } = params;

    const existingMedicine = await prisma.medicine.findUnique({
      where: {
        id: medicineId,
      },
    });

    if (!existingMedicine) {
      return new Response(JSON.stringify('Invalid Medicine ID'), { status: 400 });
    }

    const { isPaused } = await req.json();

    if (typeof isPaused !== 'boolean') {
      return new Response(JSON.stringify('Invalid Request'), { status: 400 });
    }

    const updatedMedicine = await prisma.medicine.update({
      where: {
        id: medicineId,
      },
      data: {
        isPaused,
      },
    });

    return Response.json(updatedMedicine);
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify('Internal Server Error: Failed to process the request'),
      {
        status: 500,
      },
    );
  }
}
