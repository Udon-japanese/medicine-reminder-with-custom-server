import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import globalStyles from '@styles/styles.module.scss';
import Avatar from '../components/Avatar';
import {
  CalendarMonth,
  CalendarMonthOutlined,
  Home,
  HomeOutlined,
  Medication,
  MedicationOutlined,
  SvgIconComponent,
} from '@mui/icons-material';

export type Route = {
  label: string;
  href: '/today' | '/calendar' | '/medicines' | '/mypage';
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  active: boolean;
};

export default function useRoutes() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const username = user?.name;
  const iconSrc = user?.image;
  const routes = useMemo<Route[]>(
    () => [
      {
        label: '今日',
        href: '/today',
        activeIcon: <MUIIcon icon={Home} />,
        inactiveIcon: <MUIIcon icon={HomeOutlined} />,
        active: pathname === '/today',
      },
      {
        label: 'カレンダー',
        href: '/calendar',
        activeIcon: <MUIIcon icon={CalendarMonth} />,
        inactiveIcon: <MUIIcon icon={CalendarMonthOutlined} />,
        active: pathname === '/calendar',
      },
      {
        label: 'お薬',
        href: '/medicines',
        activeIcon: <MUIIcon icon={Medication} />,
        inactiveIcon: <MUIIcon icon={MedicationOutlined} />,
        active: pathname === '/medicines',
      },
      {
        label: 'マイページ',
        href: '/mypage',
        activeIcon: <Avatar src={iconSrc} alt={username} isActive={true} />,
        inactiveIcon: <Avatar src={iconSrc} alt={username} isActive={false} />,
        active: pathname === '/mypage' && !!user,
      },
    ],
    [pathname, user, iconSrc, username]
  );

  return routes;
}

function MUIIcon({ icon: Icon }: { icon: SvgIconComponent }) {
  return <Icon className={globalStyles.icon} />;
}
