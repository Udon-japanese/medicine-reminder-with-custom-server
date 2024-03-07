import TextInput from '@/app/components/TextInput';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { useFormContext } from 'react-hook-form';

export default function MedicineNameInput() {
  const {
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors.name?.message;

  return (
    <TextInput<MedicineForm>
      name='name'
      error={err}
      label='お薬名'
      max={30}
    />
  );
}
