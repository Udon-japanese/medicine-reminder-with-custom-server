'use client';
import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';
import styles from '@styles/components/sidebar/sidebar.module.scss';
import { User } from '@prisma/client';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function InnerSidebar({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User | null;
}) {
  const pathname = usePathname();
  const isOpen = useMemo(() => !!currentUser?.id, [currentUser]);
  const isDesktopOpen = isOpen;
  const isMobileOpen = useMemo(() => {
    const basePaths = ['/today', '/calendar', '/medicines', '/settings'];
    return basePaths.includes(pathname) && isOpen;
  }, [pathname, isOpen]);

  return (
    <div className={styles.sidebar}>
      {isDesktopOpen && <DesktopSidebar user={currentUser!} />}
      {isMobileOpen && <MobileFooter user={currentUser!} />}
      <main
        className={`${styles.main} ${isMobileOpen ? styles.mobileSidebarPadding : ''} ${isDesktopOpen ? styles.desktopSidebarPadding : ''}`}
      >
        {children}
      </main>
    </div>
  );
}
