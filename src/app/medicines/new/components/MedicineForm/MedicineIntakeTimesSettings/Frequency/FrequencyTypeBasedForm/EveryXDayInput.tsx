import ErrorMessage from '@/app/components/ErrorMessage';
import NumberInput from '@/app/components/NumberInput';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';

export default function EveryXDayInput() {
  return (
    <div>
      <NumberInput<MedicineForm> name='frequency.everyXDay' max={100} min={2} />
      <ErrorMessage<MedicineForm> name='frequency.everyXDay' />
    </div>
  );
}
