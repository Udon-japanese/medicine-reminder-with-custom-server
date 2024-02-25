import ErrorMessage from '@/app/components/ErrorMessage';
import SwitchButton from '@/app/components/SwitchButton';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
export default function Notify() {
  return (
    <div>
      <label className='Label' htmlFor='notify' style={{ paddingRight: 15 }}>
        通知
      </label>
      <SwitchButton<MedicineForm> name='notify' id='notify' />
      <ErrorMessage<MedicineForm> name='notify' />
    </div>
  );
}
