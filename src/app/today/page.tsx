import Sidebar from '../components/sidebar/Sidebar';
import getMedicines from '../actions/getMedicines';
import { addDays, differenceInDays, format, getDate, startOfDay } from 'date-fns';
import { DayOfWeek } from '@prisma/client';
import { MedicineWithRelations } from '@/types';
import MedicineList from './components/MedicineList';

export default async function Page() {
  const medicines = await getMedicines();
  const intakeTimesMap = new Map<
    number,
    { dosage: number; medicine: MedicineWithRelations }[]
  >();

  medicines.filter((medicine) => {
    if (medicine.isPaused) return false;
    
    if (medicine.intakeTimes.length === 0) {
      return false;
    }

    const today = startOfDay(new Date());
    const startDate = medicine.period?.startDate!;
    const days = medicine.period?.days;

    if (days && days > 0 && addDays(startDate, days) < today) {
      return false;
    }

    let shouldTakeMedicine = false;
    switch (medicine.frequency?.type!) {
      case 'EVERYDAY':
        shouldTakeMedicine = true;
        break;
      case 'EVERY_X_DAY': {
        const daysFromStart = differenceInDays(today, startDate);
        shouldTakeMedicine = daysFromStart % medicine.frequency?.everyXDay! === 0;
        break;
      }
      case 'SPECIFIC_DAYS_OF_WEEK': {
        const dayOfWeek = format(today, 'EEEE').toUpperCase() as DayOfWeek;
        shouldTakeMedicine =
          medicine.frequency?.specificDaysOfWeek?.includes(dayOfWeek) || false;
        break;
      }
      case 'SPECIFIC_DAYS_OF_MONTH': {
        shouldTakeMedicine =
          medicine.frequency?.specificDaysOfMonth?.includes(getDate(today)) || false;
        break;
      }
      case 'ODD_EVEN_DAY': {
        shouldTakeMedicine =
          medicine.frequency?.oddEvenDay?.isOddDay === (getDate(today) % 2 === 1);
        break;
      }
      case 'ON_OFF_DAYS': {
        const daysFromStart = differenceInDays(today, startDate);
        const remainder =
          daysFromStart %
          (medicine.frequency?.onOffDays?.onDays! +
            medicine.frequency?.onOffDays?.offDays!);
        shouldTakeMedicine = remainder < medicine.frequency?.onOffDays?.onDays!;
        break;
      }
    }

    if (shouldTakeMedicine) {
      medicine.intakeTimes.forEach((intake) => {
        const intakeTime = intake.time;
        if (!intakeTimesMap.has(intakeTime)) {
          intakeTimesMap.set(intakeTime, []);
        }
        intakeTimesMap?.get(intakeTime)?.push({ medicine, dosage: intake.dosage });
      });
    }

    return shouldTakeMedicine;
  });

  const intakeTimes = [...intakeTimesMap.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <Sidebar>
      <div>今日</div>
      <br />
      {intakeTimes.length > 0 ? (
        <MedicineList intakeTimes={intakeTimes} />
      ) : (
        <div>なし</div>
      )}
    </Sidebar>
  );
}
