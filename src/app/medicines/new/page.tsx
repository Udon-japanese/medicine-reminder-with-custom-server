import MedicineForm from './components/MedicineForm';
import getMedicineUnits from '@/app/actions/getMedicineUnits';
import MedicineUnit from './components/MedicineForm/MedicineUnit';

export default async function Page() {
  const medicineUnits = await getMedicineUnits();

  return <MedicineForm MedicineUnit={<MedicineUnit medicineUnits={medicineUnits} />} />;
}
