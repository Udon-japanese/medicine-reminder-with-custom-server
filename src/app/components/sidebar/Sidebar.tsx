import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';
import sidebarStyles from '@styles/components/sidebar/sidebar.module.scss';

export default async function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={sidebarStyles.sidebar}>
      <DesktopSidebar />
      <MobileFooter />
      <main className={sidebarStyles.main}>{children}</main>
    </div>
  );
}
