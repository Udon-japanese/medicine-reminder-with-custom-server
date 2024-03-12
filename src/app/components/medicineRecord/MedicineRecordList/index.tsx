'use client';
import MedicineRecordItem from '../MedicineRecordItem';
import {
  MedicineWithDosageAndRecord,
  MedicineWithDosage,
} from '@/types';

export type MedicineRecordType = 'completed' | 'pending' | 'skipped';

export default function MedicineRecordList({
  intakeTimes,
  currentDate,
  medicineRecordType = 'pending',
}: {
  intakeTimes: [number, Array<MedicineWithDosage | MedicineWithDosageAndRecord>][];
  currentDate: Date;
  medicineRecordType?: MedicineRecordType;
}) {
  return intakeTimes.map(([time, medicines], index) => (
    <MedicineRecordItem
      key={index}
      time={time}
      medicines={medicines}
      medicineRecordType={medicineRecordType}
      currentDate={currentDate}
    />
  ));
}
