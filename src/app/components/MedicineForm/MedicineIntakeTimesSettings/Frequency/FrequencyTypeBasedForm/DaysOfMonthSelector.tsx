import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import styles from '@styles/components/medicineForm/medicineIntakeTimesSettings/frequency/frequencyTypeBasedForm/daysOfMonthSelector.module.scss';
import useErrorMessage from '@/app/hooks/useErrorMessage';

export default function DaysOfMonthSelector() {
  const {
    control,
    trigger,
  } = useFormContext<MedicineForm>();
  const daysOfMonth = [...Array(31).keys()].map((i) => i + 1);
  const watchedDaysOfMonth = useWatch({ control, name: 'frequency.specificDaysOfMonth' });
  const err = useErrorMessage<MedicineForm>('frequency.specificDaysOfMonth');
  const weeks = [];
  for (let i = 0; i < daysOfMonth.length; i += 7) {
    weeks.push(daysOfMonth.slice(i, i + 7));
  }

  const handleClick = (dayOfMonth: number) => {
    const newDaysOfWeek = watchedDaysOfMonth?.includes(dayOfMonth)
      ? watchedDaysOfMonth?.filter((d: number) => d !== dayOfMonth)
      : [...(watchedDaysOfMonth ?? []), dayOfMonth];
    return newDaysOfWeek.sort((a, b) => a - b);
  };

  return (
    <>
      <div className={styles.container}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className={styles.week}>
            <Controller
              control={control}
              name='frequency.specificDaysOfMonth'
              render={({ field: { onChange } }) => (
                <>
                  {week.map((day, dayIndex) => {
                    const dayOfMonthIndex = weekIndex * 7 + dayIndex;
                    const isSelectedDay = watchedDaysOfMonth?.includes(day);
                    return (
                      <button
                        type='button'
                        key={dayOfMonthIndex}
                        onClick={() => {
                          onChange(handleClick(day));
                          trigger('frequency.specificDaysOfMonth');
                        }}
                        className={`${styles.day} ${isSelectedDay ? styles.selectedDay : ''}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </>
              )}
            />
          </div>
        ))}
      </div>
      {err && <div className={styles.errMessage}>{err}</div>}
    </>
  );
}
