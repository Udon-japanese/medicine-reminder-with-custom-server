import styles from '@styles/components/medicines/loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.header} />
      </div>
      <div className={styles.medicineList}>
        {[...Array(7)].map((_, i) => (
          <div key={i} className={styles.medicineItem}>
            <div className={styles.medicineName} />
            {[...Array(3)].map((_, j) => (
              <div key={j} className={styles.medicineInfo} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
