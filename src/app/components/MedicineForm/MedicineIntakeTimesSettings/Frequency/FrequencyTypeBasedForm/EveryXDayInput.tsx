import NumberInput from '@/app/components/NumberInput';
import useErrorMessage from '@/app/hooks/useErrorMessage';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';

export default function EveryXDayInput() {
  const err = useErrorMessage<MedicineForm>('frequency.everyXDay');

  return (
    <div>
      <NumberInput<MedicineForm>
        name='frequency.everyXDay'
        label='X日ごと'
        max={100}
        min={2}
        error={err}
      />
    </div>
  );
}
