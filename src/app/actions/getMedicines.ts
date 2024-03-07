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

    return medicines;
  } catch (err) {
    return [];
  }
};

export default getMedicines;
