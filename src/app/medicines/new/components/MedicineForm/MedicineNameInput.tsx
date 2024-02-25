import ErrorMessage from '@/app/components/ErrorMessage';
import TextInput from '@/app/components/TextInput';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';

export default function MedicineNameInput() {
  return (
    <div>
      <TextInput<MedicineForm> name='name' placeholder='お薬の名前' max={80} />
      <ErrorMessage<MedicineForm> name='name' />
    </div>
  );
}
