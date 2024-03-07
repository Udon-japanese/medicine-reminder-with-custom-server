'use client';
import { MedicineWithRelationsAndImageUrl } from '@/types';
import MedicineItem from './MedicineItem';
import styles from '@styles/components/medicines/medicineList.module.scss';
import AddMedicineBtn from './AddMedicineBtn';

export default function MedicineList({
  medicines,
}: {
  medicines: MedicineWithRelationsAndImageUrl[];
}) {
  if (medicines.length === 0) {
    return (
      <>
        <h1>登録されているお薬はありません</h1>
        <AddMedicineBtn />
      </>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.headerText}>お薬一覧</div>
        <AddMedicineBtn />
      </div>
      <div className={styles.list}>
        {medicines.map((medicine, i) => (
          <MedicineItem key={i} medicine={medicine} />
        ))}
      </div>
    </div>
  );
}
