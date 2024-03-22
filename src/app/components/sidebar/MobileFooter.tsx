'use client';
import useRoutes from '@/app/hooks/useRoutes';
import mobileFooterStyles from '@styles/components/sidebar/mobileFooter.module.scss';
import MobileItem from './MobileItem';
import useMedicine from '@/app/hooks/useMedicine';
import { User } from '@prisma/client';

export default function MobileFooter({ user }: { user: User }) {
  const routes = useRoutes(user);
  const { isOpen } = useMedicine();

  if (isOpen) {
    return null;
  }

  return (
    <div className={mobileFooterStyles.footer}>
      {routes.map((item) => (
        <MobileItem key={item.label} {...item} />
      ))}
    </div>
  );
}
