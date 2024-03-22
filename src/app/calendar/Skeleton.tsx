import styles from '@styles/components/calendar/loading.module.scss';

export default function Skeleton() {
  const arr = [...Array(3)].map((_, i) => i + 1);
  
  return (
    <div className={styles.container}>
      <div className={styles.calendar} />
      <div className={styles.header} />
      <div className={styles.medicineListContainer}>
        {arr.map((_, i) => (
          <div key={i} className={styles.medicineItem} />
        ))}
      </div>
    </div>
  );
}
