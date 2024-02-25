import AddMedicineBtn from './components/AddMedicineBtn';
import MedicineList from './components/MedicineList';
import getMedicines from '../actions/getMedicines';

export default async function Page() {
  const medicines = await getMedicines();

  return (
    <div>
      <MedicineList medicines={medicines} />
      <AddMedicineBtn />
    </div>
  );
}
