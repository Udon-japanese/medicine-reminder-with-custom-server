import { MedicineWithRelations } from '@/types';
import MedicineItem from '../MedicineItem';

export default function MedicineList({
  intakeTimes,
}: {
  intakeTimes: [
    number,
    {
      dosage: number;
      medicine: MedicineWithRelations;
    }[],
  ][];
}) {
  return intakeTimes.map(([time, medicines], index) => (
    <MedicineItem key={index} time={time} medicinesWithDosage={medicines} />
  ));
}
