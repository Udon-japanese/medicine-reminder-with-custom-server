import styles from '@styles/components/medicineForm/medicineIntakeTimesSettings/frequency/frequencyTypeBasedForm/daysOfWeekSelector.module.scss';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { getDayOfWeekText } from '@/utils/getMedicineText';
import { Done } from '@mui/icons-material';
import { DayOfWeek } from '@prisma/client';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import useErrorMessage from '@/app/hooks/useErrorMessage';

export default function DaysOfWeekSelector() {
  const daysOfWeek = Object.values(DayOfWeek);
  const { control, trigger } = useFormContext<MedicineForm>();
  const watchedDaysOfWeek = useWatch({ control, name: 'frequency.specificDaysOfWeek' });
  const err = useErrorMessage<MedicineForm>('frequency.specificDaysOfWeek');

  const handleClick = (dayOfWeek: DayOfWeek) => {
    const newDaysOfWeek = watchedDaysOfWeek?.includes(dayOfWeek)
      ? watchedDaysOfWeek?.filter((d: DayOfWeek) => d !== dayOfWeek)
      : [...(watchedDaysOfWeek ?? []), dayOfWeek];
    return newDaysOfWeek.sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));
  };

  return (
    <>
      <Controller
        name='frequency.specificDaysOfWeek'
        control={control}
        render={({ field: { onChange } }) => (
          <>
            {daysOfWeek.map((dayOfWeek, index) => (
              <button
                key={index}
                type='button'
                className={styles.item}
                onClick={() => {
                  onChange(handleClick(dayOfWeek));
                  trigger('frequency.specificDaysOfWeek');
                }}
              >
                {getDayOfWeekText(dayOfWeek)}
                {watchedDaysOfWeek?.includes(dayOfWeek) && <Done />}
              </button>
            ))}
          </>
        )}
      />
      {err && <div className={styles.errMessage}>{err}</div>} 
    </>
  );
}
