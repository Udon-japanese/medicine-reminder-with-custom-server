import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import Frequency from './Frequency';
import Period from './Period';
import Notify from './Notify';
import { useFormContext, useWatch } from 'react-hook-form';

export default function MedicineIntakeTimesSettings() {
  const { control } = useFormContext<MedicineForm>();
  const intakeTimes = useWatch({ control, name: 'intakeTimes' });

  return (
    intakeTimes?.length > 0 && (
      <>
        <Frequency />
        <Period />
        <Notify />
      </>
    )
  );
}
