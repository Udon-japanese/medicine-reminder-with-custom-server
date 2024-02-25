import ErrorMessage from '@/app/components/ErrorMessage';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { Done } from '@mui/icons-material';
import { Controller, useFormContext } from 'react-hook-form';

export default function OddEvenDaySelector() {
  const { control, trigger } = useFormContext<MedicineForm>();

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
            <div>
              <button type='button' onClick={() => handleClick(true, onChange)}>
                奇数日
                {value && <Done />}
              </button>
            </div>
            <div>
              <button type='button' onClick={() => handleClick(false, onChange)}>
                偶数日
                {!value && <Done />}
              </button>
            </div>
          </>
        )}
      />
      <ErrorMessage<MedicineForm> name='frequency.isOddDay' />
    </>
  );
}
