import { prisma } from '@/lib/prismadb';
import getCurrentUser from './getCurrentUser';

const getMedicines = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const medicines = await prisma.medicine.findMany({
      where: {
        userId: currentUser.id,
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
      orderBy: {
        updatedAt: 'desc',
      },
    });

    medicines.forEach((medicine) => {
      if (
        medicine.frequency?.type === 'EVERYDAY' &&
        medicine.frequency.everyday?.weekendIntakeTimes
      ) {
        medicine.frequency.everyday.weekendIntakeTimes.sort((a, b) => a.time - b.time);
      }
      if (medicine.intakeTimes) {
        medicine.intakeTimes.sort((a, b) => a.time - b.time);
      }
    });

    return medicines;
  } catch (err) {
    return [];
  }
};

export default getMedicines;
