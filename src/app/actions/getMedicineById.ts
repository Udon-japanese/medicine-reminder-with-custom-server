import { prisma } from '@/lib/prismadb';
import getCurrentUser from './getCurrentUser';

const getMedicineById = async (medicineId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const medicine = await prisma.medicine.findUnique({
      where: {
        id: medicineId,
      },
      include: {
        intakeTimes: true,
        frequency: {
          include: {
            everyday: {
              include: {
                weekendIntakeTimes: true,
              },
            },
            oddEvenDay: true,
            onOffDays: true,
          },
        },
        period: true,
        stock: true,
        memo: true,
      },
    });

    if (
      medicine?.frequency?.type === 'EVERYDAY' &&
      medicine.frequency.everyday?.weekendIntakeTimes
    ) {
      medicine.frequency.everyday.weekendIntakeTimes.sort((a, b) => a.time - b.time);
    }

    if (medicine?.intakeTimes) {
      medicine.intakeTimes.sort((a, b) => a.time - b.time);
    }

    return medicine;
  } catch (error) {
    console.error(error, 'SERVER_ERROR');
    return null;
  }
};

export default getMedicineById;
