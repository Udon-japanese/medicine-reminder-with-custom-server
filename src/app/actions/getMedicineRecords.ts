import { prisma } from '@/lib/prismadb';
import getCurrentUser from './getCurrentUser';

const getMedicineRecords = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const medicineRecords = await prisma.medicineRecord.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return medicineRecords;
  } catch (err) {
    return [];
  }
};

export default getMedicineRecords;
