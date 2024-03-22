import MedicineRecordForm from '../components/medicineRecord/MedicineRecordForm';
import getExistingMedicinesWithRecords from '@/utils/getExistingMedicinesWithRecords';

export default async function Page() {
  const today = new Date();
  const { medicines, medicineRecords } = await getExistingMedicinesWithRecords();

  return (
    <MedicineRecordForm
      currentDate={today}
      existingMedicines={medicines}
      medicineRecords={medicineRecords}
    />
  );
}
