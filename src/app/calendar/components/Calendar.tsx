'use client';
import { useState } from 'react';
import ReactCalendar from 'react-calendar';
import { View } from 'react-calendar/dist/cjs/shared/types';
import { MedicineWithRelations } from '@/types';
import MedicineRecordForm from '@/app/components/medicineRecord/MedicineRecordForm';
import { MedicineRecord } from '@prisma/client';
import isCurrentMedicine from '@/utils/isCurrentMedicine';
import 'react-calendar/dist/Calendar.css';

const tileContent = ({
  date,
  view,
  medicines,
}: {
  date: Date;
  view: View;
  medicines: MedicineWithRelations[];
}) => {
  if (view === 'month') {
    const currentDayMedicines = medicines.filter((m) =>
      isCurrentMedicine({ period: m?.period, frequency: m?.frequency, currentDate: date }),
    );
    return <div>{currentDayMedicines.map((m) => m?.name).join('\n')}</div>;
  }
};

export default function Calendar({
  medicines,
  medicineRecords,
}: {
  medicines: MedicineWithRelations[];
  medicineRecords: MedicineRecord[];
}) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  return (
    <div>
      <ReactCalendar
        value={currentDate}
        onClickDay={(newValue) => setCurrentDate(newValue)}
        locale='ja-JP'
        calendarType='gregory'
        tileContent={({ date, view }) => tileContent({ date, view, medicines })}
      />
      <MedicineRecordForm
        currentDate={currentDate}
        existingMedicines={medicines}
        medicineRecords={medicineRecords}
      />
    </div>
  );
}
