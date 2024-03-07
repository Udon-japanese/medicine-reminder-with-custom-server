import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';
import { medicineFormSchema } from '@/types/zodSchemas/medicineForm/schema';
import { NextResponse } from 'next/server';
import { convertMedicineForm } from '../utils';
import { getUpdateMedicineData } from './utils';
import { deleteImageByIdServer, getImageUrlByIdServer } from '../../lib/cloudinary';

type Params = { params: { medicineId: string } };

export async function DELETE(req: Request, { params }: Params) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { medicineId } = params;

    const existingMedicine = await prisma.medicine.findUnique({
      where: {
        id: medicineId,
      },
      include: {
        memo: true,
      },
    });

    const imageId = existingMedicine?.memo?.imageId;
    const imageUrl = await getImageUrlByIdServer(imageId);
    if (imageUrl) {
      await deleteImageByIdServer(imageId);
    }

    if (!existingMedicine) {
      return new NextResponse('Invalid Medicine ID', { status: 400 });
    }

    const deletedConversation = await prisma.medicine.deleteMany({
      where: {
        id: medicineId,
      },
    });

    return NextResponse.json(deletedConversation);
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
    const { medicineId } = params;

    const existingMedicine = await prisma.medicine.findUnique({
      where: {
        id: medicineId,
      },
      include: {
        intakeTimes: true,
        frequency: {
          include: {
            oddEvenDay: true,
            onOffDays: true,
          },
        },
        period: true,
        stock: true,
        memo: true,
      },
    });

    if (!existingMedicine) {
      return new NextResponse('Invalid Medicine ID', { status: 400 });
    }

    const { imageId, imageIdToDelete, medicineForm } = await req.json();

    const validation = medicineFormSchema.safeParse(medicineForm);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, {
        status: 400,
      });
    }

    let imageIdData = imageId;

    const deleteImageUrl = await getImageUrlByIdServer(imageIdToDelete);
    if (deleteImageUrl && imageIdToDelete === existingMedicine?.memo?.imageId) {
      await deleteImageByIdServer(imageIdToDelete);
      if (imageIdToDelete === imageId) {
        imageIdData = null;
      }
    }

    const medicine = validation.data;
    const convertedMedicine = convertMedicineForm(medicine);
    const data = await getUpdateMedicineData({
      convertedMedicine,
      imageId: imageIdData,
      userId: currentUser.id,
      existingMedicineId: medicineId,
      existingMedicine,
    });

    const updatedMedicine = await prisma.medicine.update({
      where: {
        id: medicineId,
      },
      data,
    });

    return NextResponse.json(updatedMedicine);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error: Failed to process the request', {
      status: 500,
    });
  }
}
