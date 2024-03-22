'use client';
import { MedicineWithRelations } from '@/types';
import MedicineRecordForm from '@/app/components/medicineRecord/MedicineRecordForm';
import { MedicineRecord } from '@prisma/client';
import Calendar from './Calendar';
import { useState } from 'react';

export default function CalendarWithMedicineRecord({
  medicines,
  medicineRecords,
}: {
  medicines: MedicineWithRelations[];
  medicineRecords: MedicineRecord[];
}) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  return (
    <>
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} medicines={medicines} medicineRecords={medicineRecords} />
      <MedicineRecordForm
        currentDate={currentDate}
        existingMedicines={medicines}
        medicineRecords={medicineRecords}
      />
    </>
  );
}
