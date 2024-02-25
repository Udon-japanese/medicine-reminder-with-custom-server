import Link from 'next/link';
import desktopItemStyles from '@styles/components/sidebar/desktopItem.module.scss';
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
  const isNotMyPage = href !== '/mypage';

  return (
    <li key={label} className={desktopItemStyles.li}>
      <Link href={href} className={desktopItemStyles.item}>
        <div
          className={`${
            isNotMyPage ? desktopItemStyles.icon : ''
          } ${active && isNotMyPage ? desktopItemStyles.active : ''}`}
        >
          {active ? activeIcon : inactiveIcon}
          <VisuallyHidden.Root>{label}</VisuallyHidden.Root>
        </div>
        <div className={isNotMyPage ? desktopItemStyles.label : desktopItemStyles.myPageLabel}>{label}</div>
      </Link>
    </li>
  );
}
