import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { Done } from '@mui/icons-material';
import { Controller, useFormContext } from 'react-hook-form';
import styles from '@styles/components/medicineForm/medicineIntakeTimesSettings/frequency/frequencyTypeBasedForm/oddEvenDaySelector.module.scss';
import useErrorMessage from '@/app/hooks/useErrorMessage';

export default function OddEvenDaySelector() {
  const { control, trigger } = useFormContext<MedicineForm>();
  const err = useErrorMessage<MedicineForm>('frequency.isOddDay');
  
  const handleClick = (isOddDay: boolean, onChange: (...event: any[]) => void) => {
    onChange(isOddDay);
    trigger('frequency.isOddDay');
  };

  return (
    <>
      <Controller
        control={control}
        name='frequency.isOddDay'
        render={({ field: { value, onChange } }) => (
          <>
            <button
              type='button'
              className={styles.item}
              onClick={() => handleClick(true, onChange)}
            >
              奇数日
              {value && <Done />}
            </button>
            <button
              type='button'
              className={styles.item}
              onClick={() => handleClick(false, onChange)}
            >
              偶数日
              {!value && <Done />}
            </button>
          </>
        )}
      />
      {err && <div className={err}></div>}
    </>
  );
}
