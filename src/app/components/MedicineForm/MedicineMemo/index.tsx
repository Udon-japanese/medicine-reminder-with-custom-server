import { ReactNode } from 'react';
import MemoInput from './MemoTextInput';
import styles from '@styles/components/medicineForm/medicineMemo/index.module.scss';

export default function MedicineMemo({ MemoImage }: { MemoImage: ReactNode }) {
  return (
    <div className={styles.container}>
      {MemoImage}
      <MemoInput />
    </div>
  );
}
