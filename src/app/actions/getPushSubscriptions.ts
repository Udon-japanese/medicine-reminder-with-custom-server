import { prisma } from '@/lib/prismadb';
import getCurrentUser from './getCurrentUser';

const getPushSubscriptions = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const pushSubscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return pushSubscriptions;
  } catch (err) {
    return [];
  }
};

export default getPushSubscriptions;
