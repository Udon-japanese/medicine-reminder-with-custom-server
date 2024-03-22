import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from '@mui/icons-material';
import ReactCalendar from 'react-calendar';
import { Dispatch, SetStateAction } from 'react';
import { MedicineWithRelations } from '@/types';
import { MedicineRecord } from '@prisma/client';
import { format } from 'date-fns';
import useIntakeTimes from '../hooks/useIntakeTimes';
import { View } from 'react-calendar/dist/cjs/shared/types';
import styles from '@styles/components/calendar/calendar.module.scss';
import '@styles/components/calendar/calendar.scss';

export default function Calendar({
  medicines,
  medicineRecords,
  currentDate,
  setCurrentDate,
}: {
  medicines: MedicineWithRelations[];
  medicineRecords: MedicineRecord[];
  currentDate: Date;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
}) {
  return (
    <div className={styles.container}>
      <ReactCalendar
        value={currentDate}
        onClickDay={(newValue) => setCurrentDate(newValue)}
        locale='ja-JP'
        formatDay={() => ''}
        formatMonth={(_, date) => format(date, 'M月')}
        formatYear={(_, date) => date.getFullYear().toString()}
        calendarType='gregory'
        next2Label={<KeyboardDoubleArrowRight />}
        nextLabel={<KeyboardArrowRight />}
        prev2Label={<KeyboardDoubleArrowLeft />}
        prevLabel={<KeyboardArrowLeft />}
        tileContent={({ date, view }) => (
          <TileContent
            date={date}
            view={view}
            medicines={medicines}
            medicineRecords={medicineRecords}
          />
        )}
      />
    </div>
  );
}

const TileContent = ({
  date,
  view,
  medicines,
  medicineRecords,
}: {
  date: Date;
  view: View;
  medicines: MedicineWithRelations[];
  medicineRecords: MedicineRecord[];
}) => {
  const { getMedicinesStatus } = useIntakeTimes({
    currentDate: date,
    existingMedicines: medicines,
    medicineRecords,
  });
  
  if (view === 'month') {
    const medicinesStatus = getMedicinesStatus();

    const getStatusClassName = () => {
      switch (medicinesStatus) {
        case 'no-intake-times':
          return '';
        case 'future':
          return styles.future;
        case 'all-completed':
          return styles.allCompleted;
        case 'some-completed':
          return styles.someCompleted;
        case 'no-completed':
          return styles.noCompleted;
      }
    };

    return (
      <div className={styles.day} aria-label={format(date, 'yyyy年M月d日')}>
        {date.getDate().toString()}
        <span className={`${styles.medicineStatus} ${getStatusClassName()}`} />
      </div>
    );
  }
};
