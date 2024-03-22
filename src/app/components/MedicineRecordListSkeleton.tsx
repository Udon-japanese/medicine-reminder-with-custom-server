import styles from '@styles/components/medicineRecordListSkeleton.module.scss';

export default function MedicineRecordListSkeleton() {
  return (
    <>
      <div className={styles.header} />
      <div className={styles.medicineItemListContainer}>
        {[...Array(7)].map((_, i) => (
          <div key={i} className={styles.medicineItem}>
            <div className={styles.actionAllButton} />
            <div className={styles.medicineInfo}>
              <div className={styles.medicineIntakeTime} />
              <div className={styles.medicineListContainer}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={styles.medicineContainer}>
                    <div className={styles.medicineName} />
                    <div className={styles.medicineDosage} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
