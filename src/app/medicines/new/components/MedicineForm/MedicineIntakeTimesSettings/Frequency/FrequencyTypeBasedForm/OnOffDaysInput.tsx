import ErrorMessage from '@/app/components/ErrorMessage';
import NumberInput from '@/app/components/NumberInput';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';

export default function OnOffDaysInput() {
  return (
    <>
      <div>
        <NumberInput<MedicineForm> name='frequency.onDays' max={200} min={1} />
        <ErrorMessage<MedicineForm> name='frequency.onDays' />
      </div>
      <div>
        <NumberInput<MedicineForm> name='frequency.offDays' max={200} min={1} />
        <ErrorMessage<MedicineForm> name='frequency.offDays' />
      </div>
    </>
  );
}
