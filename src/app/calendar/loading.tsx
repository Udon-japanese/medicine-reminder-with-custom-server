import styles from '@styles/components/calendar/skeleton.module.scss';
import MedicineRecordListSkeleton from '@/app/components/MedicineRecordListSkeleton';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.calendar} />
      <MedicineRecordListSkeleton />
    </div>
  );
}
