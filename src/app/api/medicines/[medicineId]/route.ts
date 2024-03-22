import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';
import { medicineFormSchema } from '@/types/zodSchemas/medicineForm/schema';
import { NextResponse } from 'next/server';
import { convertMedicineForm } from '../utils';
import { getUpdateMedicineData } from './utils';
import { deleteImageByIdServer, getImageUrlByIdServer } from '../../lib/cloudinary';
import getMedicineById from '@/app/actions/getMedicineById';

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

    if (!existingMedicine) {
      return new NextResponse('Invalid Medicine ID', { status: 400 });
    }

    const imageId = existingMedicine?.memo?.imageId;
    const imageUrl = await getImageUrlByIdServer(imageId);

    if (imageUrl) {
      await deleteImageByIdServer(imageId);
    }

    const deletedMedicine = await prisma.medicine.delete({
      where: {
        id: medicineId,
      },
    });

    return NextResponse.json(deletedMedicine);
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

    const existingMedicine = await getMedicineById(medicineId);

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

    if (typeof imageId !== 'undefined' && typeof imageId !== 'string') {
      return new NextResponse('Invalid Image ID', {
        status: 400,
      });
    }

    if (typeof imageIdToDelete !== 'undefined' && typeof imageIdToDelete !== 'string') {
      return new NextResponse('Invalid Image ID to delete', {
        status: 400,
      });
    }

    if (imageId) {
      const imageUrl = await getImageUrlByIdServer(imageId);

      if (!imageUrl) {
        return new NextResponse('Invalid Image ID', {
          status: 400,
        });
      }
    }

    if (imageIdToDelete) {
      const imageUrlToDelete = await getImageUrlByIdServer(imageIdToDelete);

      if (!imageUrlToDelete) {
        return new NextResponse('Invalid Image ID to delete', {
          status: 400,
        });
      }
    }

    let imageIdData: string | undefined = imageId;

    const deleteImageUrl = await getImageUrlByIdServer(imageIdToDelete);
    if (deleteImageUrl && imageIdToDelete === existingMedicine?.memo?.imageId) {
      await deleteImageByIdServer(imageIdToDelete);
      if (imageIdToDelete === imageId) {
        imageIdData = undefined;
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
