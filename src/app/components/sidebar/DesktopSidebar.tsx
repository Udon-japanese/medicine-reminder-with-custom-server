'use client';
import useRoutes from '@/app/hooks/useRoutes';
import DesktopItem from './DesktopItem';
import styles from '@styles/components/sidebar/desktopSidebar.module.scss';
import { User } from '@prisma/client';

export default function DesktopSidebar({ user }: { user: User }) {
  const routes = useRoutes(user);

  return (
    <>
      <div className={styles.sidebar}>
        <nav className={styles.nav}>
          <ul role='list' className={styles.list}>
            {routes.map((item) => (
              <DesktopItem key={item.label} {...item} />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
