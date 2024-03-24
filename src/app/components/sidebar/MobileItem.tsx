'use client';
import Link from 'next/link';
import styles from '@styles/components/sidebar/mobileItem.module.scss';
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
    <Link href={href} className={styles.item}>
      <div>
        {active ? activeIcon : inactiveIcon}
        <VisuallyHidden.Root>{label}</VisuallyHidden.Root>
      </div>
      <div className={styles.label}>{label}</div>
    </Link>
  );
}
