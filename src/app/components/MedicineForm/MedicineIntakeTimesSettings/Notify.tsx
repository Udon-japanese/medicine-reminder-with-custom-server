import SwitchButton from '@/app/components/SwitchButton';
import styles from '@/styles/components/medicineForm/medicineIntakeTimesSettings/notify.module.scss';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { useFormContext } from 'react-hook-form';

export default function Notify() {
  const {
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors?.notify?.message;

  return (
    <>
      <label htmlFor='notify' className={styles.labelContainer}>
        <div>通知</div>
        <SwitchButton<MedicineForm> name='notify' id='notify' />
      </label>
      {err && <div className={styles.errMessage}>{err}</div>}
    </>
  );
}
