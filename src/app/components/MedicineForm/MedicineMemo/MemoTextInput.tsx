import TextInput from '@/app/components/TextInput';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { useFormContext } from 'react-hook-form';

export default function MemoTextInput() {
  const {
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors.memo?.message;

  return (
    <TextInput<MedicineForm>
      name='memo'
      placeholder='メモ'
      max={255}
      error={err}
    />
  );
}
