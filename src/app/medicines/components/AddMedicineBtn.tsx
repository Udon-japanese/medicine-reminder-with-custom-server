'use client';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import addMedicineBtnStyles from '@styles/components/medicines/addMedicineBtn.module.scss';
import { Add, Medication } from '@mui/icons-material';
import Link from 'next/link';

export default function AddMedicineBtn() {
  const { isMd } = useMediaQuery();
  const NEW_MEDICINE_LINK = '/medicines/new';

  if (isMd) {
    return (
      <>
        <Link
          href={NEW_MEDICINE_LINK}
          role="button"
          className={addMedicineBtnStyles.desktopBtn}
        >
          <Medication className={addMedicineBtnStyles.desktopBtnIcon} />
          <span>お薬を追加</span>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href={NEW_MEDICINE_LINK}
        role="button"
        className={addMedicineBtnStyles.mobileBtn}
      >
        <Add fontSize="inherit" />
      </Link>
    </>
  );
}
