import MedicineForm from '@/app/components/MedicineForm';
import getMedicineUnits from '@/app/actions/getMedicineUnits';

export default async function Page() {
  const medicineUnits = await getMedicineUnits();

  return <MedicineForm medicineUnits={medicineUnits} />;
}
