import { prisma } from '@/lib/prismadb';
import Sidebar from '../components/sidebar/Sidebar';
import UserSettingForm from './components/UserSettingForm';
import getCurrentUser from '../actions/getCurrentUser';

export default async function Page() {
  const currentUser = await getCurrentUser();
  const pushSubscriptions = await prisma.pushSubscription.findMany({
    where: {
      userId: currentUser?.id,
    }
  });
  return (
    <Sidebar>
      <UserSettingForm pushSubscriptions={pushSubscriptions} />
    </Sidebar>
  );
}
