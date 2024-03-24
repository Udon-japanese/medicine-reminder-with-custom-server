import { ChevronRight } from '@mui/icons-material';
import styles from '@styles/components/settings/index.module.scss';
import Link from 'next/link';

export default function Page() {
  const settings = [
    {
      title: '通知',
      href: '/settings/notify',
    },
    {
      title: 'アカウント',
      href: '/settings/account',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.generalHeaderText}>設定</div>
      <div className={styles.settingList}>
      {settings.map(({ title, href }, i) => (
        <Link className={styles.settingItem} href={href} key={i}>
          {title}
          <ChevronRight />
        </Link>
      ))}
      </div>
    </div>
  );
}
