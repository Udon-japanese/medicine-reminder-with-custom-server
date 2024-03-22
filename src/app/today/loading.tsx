import MedicineRecordListSkeleton from '../components/MedicineRecordListSkeleton';
import styles from '@styles/components/today/skeleton.module.scss';

export default function Loading() {
  return (
    <div className={styles.container}>
      <MedicineRecordListSkeleton />
    </div>
  );
}
