import getCurrentUser from '@/app/actions/getCurrentUser';
import InnerSidebar from './InnerSidebar';
import { ReactNode } from 'react';

export default async function Sidebar({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser();

  return <InnerSidebar currentUser={currentUser}>{children}</InnerSidebar>;
}
