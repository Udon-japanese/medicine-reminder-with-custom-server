import getExistingMedicinesWithRecords from '@/utils/getExistingMedicinesWithRecords';
import Sidebar from '../components/sidebar/Sidebar';
import Calendar from './components/Calendar';

export default async function Page() {
  const { medicines, medicineRecords } = await getExistingMedicinesWithRecords();

  return (
    <>
      <Sidebar>
        <Calendar medicines={medicines} medicineRecords={medicineRecords} />
      </Sidebar>
    </>
  );
}
