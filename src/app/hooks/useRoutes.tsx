import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
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
import { User } from '@prisma/client';

export type Route = {
  label: string;
  href: '/today' | '/calendar' | '/medicines' | '/settings';
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  active: boolean;
};

export default function useRoutes(user: User) {
  const pathname = usePathname();
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
        active: pathname.startsWith('/medicines'),
      },
      {
        label: '設定',
        href: '/settings',
        activeIcon: <Avatar src={iconSrc} alt={username} isActive={true} />,
        inactiveIcon: <Avatar src={iconSrc} alt={username} isActive={false} />,
        active: pathname.startsWith('/settings') && !!user,
      },
    ],
    [pathname, user, iconSrc, username],
  );

  return routes;
}

function MUIIcon({ icon: Icon }: { icon: SvgIconComponent }) {
  return <Icon className={globalStyles.icon} />;
}
