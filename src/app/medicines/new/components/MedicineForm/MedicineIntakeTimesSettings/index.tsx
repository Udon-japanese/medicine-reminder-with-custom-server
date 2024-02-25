import { useFieldArrayFormContext } from '@/app/contexts/FieldArrayFormContext';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import Frequency from './Frequency';
import Period from './Period';
import Notify from './Notify';

export default function MedicineIntakeTimesSettings() {
  const { fields } = useFieldArrayFormContext<MedicineForm>();
  return (
    fields.length > 0 && (
      <>
        <Frequency />
        <Period />
        <Notify />
      </>
    )
  );
}
