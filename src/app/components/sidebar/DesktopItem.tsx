import Link from 'next/link';
import styles from '@styles/components/sidebar/desktopItem.module.scss';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export default function DesktopItem({
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
  const isNotSettings = href !== '/settings';

  return (
    <li key={label} className={styles.li}>
      <Link href={href} className={styles.item}>
        <div
          className={`${
            isNotSettings ? styles.icon : ''
          } ${active && isNotSettings ? styles.active : ''}`}
        >
          {active ? activeIcon : inactiveIcon}
          <VisuallyHidden.Root>{label}</VisuallyHidden.Root>
        </div>
        <div
          className={
            isNotSettings ? styles.label : styles.settingsLabel
          }
        >
          {label}
        </div>
      </Link>
    </li>
  );
}
