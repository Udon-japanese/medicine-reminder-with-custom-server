'use client';
import { MedicineWithRelationsAndImageUrl } from '@/types';
import MedicineItem from './MedicineItem';
import styles from '@styles/components/medicines/medicineList.module.scss';
import AddMedicineBtn from './AddMedicineBtn';
import Image from 'next/image';

export default function MedicineList({
  medicines,
}: {
  medicines: MedicineWithRelationsAndImageUrl[];
}) {
  const emptyStateMessage = '登録されているお薬はありません';

  if (medicines.length === 0) {
    return (
      <>
        {' '}
        <div className={styles.emptyContainer}>
          <Image
            src='/empty.png'
            alt={emptyStateMessage}
            width={563}
            height={165}
            sizes='100vw'
            className={styles.emptyImage}
            priority
          />
          <div>{emptyStateMessage}</div>
          <AddMedicineBtn />
        </div>
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
