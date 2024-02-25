import ErrorMessage from '@/app/components/ErrorMessage';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { translateDayOfWeekToJapanese } from '@/utils/translateToJapanese';
import { Done } from '@mui/icons-material';
import { DayOfWeek } from '@prisma/client';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

export default function DaysOfWeekSelector() {
  const daysOfWeek = Object.values(DayOfWeek);
  const { control, trigger } = useFormContext<MedicineForm>();
  const watchedDaysOfWeek = useWatch({ control, name: 'frequency.specificDaysOfWeek' });

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
              <div key={index}>
                <button
                  type='button'
                  onClick={() => {
                    onChange(handleClick(dayOfWeek));
                    trigger('frequency.specificDaysOfWeek');
                  }}
                >
                  {translateDayOfWeekToJapanese(dayOfWeek)}
                  {watchedDaysOfWeek?.includes(dayOfWeek) && <Done />}
                </button>
              </div>
            ))}
          </>
        )}
      />
      <ErrorMessage<MedicineForm> name='frequency.specificDaysOfWeek' />
    </>
  );
}
