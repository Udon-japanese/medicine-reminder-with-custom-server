import getCurrentUser from '@/app/actions/getCurrentUser';
import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';
import sidebarStyles from '@styles/components/sidebar/sidebar.module.scss';

export default async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <div className={sidebarStyles.sidebar}>
      <DesktopSidebar user={currentUser!} />
      <MobileFooter user={currentUser!} />
      <main className={sidebarStyles.main}>{children}</main>
    </div>
  );
}
