'use client';
import useRoutes from '@/app/hooks/useRoutes';
import styles from '@styles/components/sidebar/mobileFooter.module.scss';
import MobileItem from './MobileItem';
import { User } from '@prisma/client';

export default function MobileFooter({ user }: { user: User }) {
  const routes = useRoutes(user);

  return (
    <div className={styles.footer}>
      {routes.map((item) => (
        <MobileItem key={item.label} {...item} />
      ))}
    </div>
  );
}
