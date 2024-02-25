import ErrorMessage from '@/app/components/ErrorMessage';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

export default function DaysOfMonthSelector() {
  const { control, trigger } = useFormContext<MedicineForm>();
  const daysOfMonth = [...Array(31).keys()].map((i) => i + 1);
  const watchedDaysOfMonth = useWatch({ control, name: 'frequency.specificDaysOfMonth' });
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
      <table>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              <Controller
                control={control}
                name='frequency.specificDaysOfMonth'
                render={({ field: { onChange } }) => (
                  <>
                    {week.map((day, dayIndex) => {
                      const dayOfMonthIndex = weekIndex * 7 + dayIndex;
                      return (
                        <td key={dayOfMonthIndex}>
                          <button
                            type='button'
                            onClick={() => {
                              onChange(handleClick(day));
                              trigger('frequency.specificDaysOfMonth');
                            }}
                            style={{
                              color: watchedDaysOfMonth?.includes(day) ? 'blue' : 'black',
                            }}
                          >
                            {day}
                          </button>
                        </td>
                      );
                    })}
                  </>
                )}
              />
            </tr>
          ))}
        </tbody>
      </table>
      <ErrorMessage<MedicineForm> name='frequency.specificDaysOfMonth' />
    </>
  );
}
