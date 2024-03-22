'use client';
import MedicineRecordItem from '../MedicineRecordItem';
import { MedicineWithDosageAndRecord, MedicineWithDosage } from '@/types';

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
  return intakeTimes.map(([intakeTime, medicinesWithDosage]) => (
    <MedicineRecordItem
      key={intakeTime}
      intakeTime={intakeTime}
      medicinesWithDosage={medicinesWithDosage}
      medicineRecordType={medicineRecordType}
      currentDate={currentDate}
    />
  ));
}
