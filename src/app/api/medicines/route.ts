import getCurrentUser from '@/app/actions/getCurrentUser';
import { medicineFormSchema } from '@/types/zodSchemas/medicineForm/schema';
import { NextResponse } from 'next/server';
import { convertMedicineForm, createMedicineData } from './utils';
import { prisma } from '@/lib/prismadb';

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { imageUrl, medicine } = await req.json();
    const validation = medicineFormSchema.safeParse(medicine);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, {
        status: 400,
      });
    }

    const medicineForm = validation.data;
    const convertedMedicineForm = convertMedicineForm(medicineForm);
    const data = createMedicineData({
      convertedMedicineForm,
      imageUrl,
      userId: currentUser.id,
    });
    const savedMedicine = await prisma.medicine.create({
      data,
    });

    return NextResponse.json(savedMedicine);
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error: Failed to process the request', {
      status: 500,
    });
  }
}
