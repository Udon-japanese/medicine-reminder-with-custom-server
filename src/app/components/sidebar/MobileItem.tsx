'use client';
import Link from 'next/link';
import mobileItemStyles from '@styles/components/sidebar/mobileItem.module.scss';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export default function MobileItem({
  label,
  href,
  activeIcon,
  inactiveIcon,
  active,
}: {
  label: string;
  href: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link href={href} className={mobileItemStyles.item}>
      <div>
        {active ? activeIcon : inactiveIcon}
        <VisuallyHidden.Root>{label}</VisuallyHidden.Root>
      </div>
      <div className={mobileItemStyles.label}>{label}</div>
    </Link>
  );
}
