'use client';
import styles from '@styles/components/medicines/addMedicineBtn.module.scss';
import { Add } from '@mui/icons-material';
import Link from 'next/link';

export default function AddMedicineBtn() {
  const NEW_MEDICINE_LINK = '/medicines/new';
  return (
    <>
      <Link
        href={NEW_MEDICINE_LINK}
        role="button"
        className={styles.mobileBtn}
      >
        <Add fontSize="inherit" />
      </Link>
      <div className={styles.desktopBtnContainer}>
        <Link
          href={NEW_MEDICINE_LINK}
          role="button"
          className={styles.desktopBtn}
        >
          <Add fontSize='small' />
          <span>お薬を追加</span>
        </Link>
      </div>
    </>
  );
}
