import getPushSubscriptions from '@/app/actions/getPushSubscriptions';
import NotifyManager from './NotifyManager';

export default async function Page() {
  const pushSubscriptions = await getPushSubscriptions();

  return <NotifyManager pushSubscriptions={pushSubscriptions} />;
}
