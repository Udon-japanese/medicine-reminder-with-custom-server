'use client';
import styles from '@styles/components/header.module.scss';
import LinerProgress from './LinerProgress';

export default function Header({
  mobileHeaderPosition = 'sticky',
  headerText,
  actionIcon,
  action,
  showMobileLinerProgress = false,
  hideActionButtonOnDesktop = false,
}: {
  mobileHeaderPosition?: 'sticky' | 'fixed';
  headerText: string;
  actionIcon: React.ReactNode;
  action: () => void;
  showMobileLinerProgress?: boolean;
  hideActionButtonOnDesktop?: boolean;
}) {
  return (
    <>
      <div className={styles.desktopHeaderContainer}>
        <div>{headerText}</div>
        {!hideActionButtonOnDesktop && (
          <button className={styles.desktopActionButton} onClick={action} type='button'>
            {actionIcon}
          </button>
        )}
      </div>
      <div
        className={`${styles.mobileHeaderContainer} ${mobileHeaderPosition === 'sticky' ? styles.mobileSticky : styles.mobileFixed}`}
      >
        {showMobileLinerProgress && (
          <LinerProgress show className={styles.mobileLinerProgress} />
        )}
        <button className={styles.mobileActionButton} onClick={action} type='button'>
          {actionIcon}
        </button>
        <div className={styles.mobileHeaderText}>{headerText}</div>
      </div>
    </>
  );
}
