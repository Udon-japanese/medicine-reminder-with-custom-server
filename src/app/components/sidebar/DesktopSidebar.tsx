'use client';
import useRoutes from '@/app/hooks/useRoutes';
import DesktopItem from './DesktopItem';
import desktopSidebarStyles from '@styles/components/sidebar/desktopSidebar.module.scss';
import { User } from '@prisma/client';

export default function DesktopSidebar({ user }: { user: User }) {
  const routes = useRoutes(user);

  return (
    <>
      <div className={desktopSidebarStyles.sidebar}>
        <nav className={desktopSidebarStyles.nav}>
          <ul role='list' className={desktopSidebarStyles.list}>
            {routes.map((item) => (
              <DesktopItem key={item.label} {...item} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
