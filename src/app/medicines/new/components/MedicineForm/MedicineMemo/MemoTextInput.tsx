import ErrorMessage from '@/app/components/ErrorMessage';
import TextInput from '@/app/components/TextInput';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';

export default function MemoTextInput() {
  return (
    <>
      <TextInput<MedicineForm> placeholder='メモ' name='memo' max={255} />
      <ErrorMessage<MedicineForm> name='memo' />
    </>
  );
}
