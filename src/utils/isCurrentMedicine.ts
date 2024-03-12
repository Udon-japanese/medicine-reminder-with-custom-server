import { MedicineWithRelations } from '@/types';
import { addDays, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { isIntakeDate } from './isIntakeDate';

export default function isCurrentMedicine({
  period,
  frequency,
  currentDate,
}: {
  period: MedicineWithRelations['period'];
  frequency: MedicineWithRelations['frequency'];
  currentDate: Date;
}) {
  if (!(period && frequency)) {
    return false;
  }

  const startDate = startOfDay(period.startDate);
  const days = period.days || 0;

  if (days) {
    const endDate = addDays(startDate, days);
    if (isBefore(endDate, currentDate) || isBefore(currentDate, startDate)) {
      return false;
    }
  } else if (!(isAfter(currentDate, startDate) || isSameDay(currentDate, startDate))) {
    return false;
  }

  return isIntakeDate({ frequency, currentDate, startDate });
}
