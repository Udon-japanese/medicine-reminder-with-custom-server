import styles from '@styles/components/linerProgress.module.scss';

export default function LinerProgress({
  show,
  className,
}: {
  show: boolean;
  className?: string;
}) {
  if (show) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.linerProgress}>
          <div className={styles.linerProgressValue} />
        </div>
      </div>
    );
  }

  return null;
}
