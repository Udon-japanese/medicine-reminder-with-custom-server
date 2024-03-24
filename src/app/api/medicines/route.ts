import getCurrentUser from '@/app/actions/getCurrentUser';
import { medicineFormSchema } from '@/types/zodSchemas/medicineForm/schema';

import { convertMedicineForm, getCreateMedicineData } from './utils';
import { prisma } from '@/lib/prismadb';
import { getImageUrlByIdServer } from '../lib/cloudinary';

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new Response(JSON.stringify('Unauthorized'), { status: 401 });
  }

  try {
    const { imageId, medicineForm } = await req.json();
    const validation = medicineFormSchema.safeParse(medicineForm);
    if (!validation.success) {
      return Response.json(validation.error.errors, {
        status: 400,
      });
    }

    if (typeof imageId !== 'undefined' && typeof imageId !== 'string') {
      return new Response(JSON.stringify('Invalid Image ID'), {
        status: 400,
      });
    }

    if (typeof imageId === 'string') {
      const imageUrl = await getImageUrlByIdServer(imageId);

      if (!imageUrl) {
        return new Response(JSON.stringify('Invalid Image ID'), {
          status: 400,
        });
      }
    }

    const medicine = validation.data;
    const convertedMedicine = convertMedicineForm(medicine);
    const data = getCreateMedicineData({
      convertedMedicine,
      imageId,
      userId: currentUser.id,
    });
    const savedMedicine = await prisma.medicine.create({
      data,
    });

    return Response.json(savedMedicine);
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify('Internal Server Error: Failed to process the request'), {
      status: 500,
    });
  }
}
