import getExistingMedicinesWithRecords from '@/utils/getExistingMedicinesWithRecords';
import CalendarWithMedicineRecord from './CalendarWithMedicineRecord';

export default async function Page() {
  const { medicines, medicineRecords } = await getExistingMedicinesWithRecords();
  return (
    <CalendarWithMedicineRecord medicines={medicines} medicineRecords={medicineRecords} />
  );
}
