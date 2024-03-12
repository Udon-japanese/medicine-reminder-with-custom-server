import { MedicineWithRelations } from '@/types';
import { DayOfWeek } from '@prisma/client';
import { differenceInCalendarDays, format, getDate } from 'date-fns';

export const isIntakeDate = ({
  frequency,
  currentDate,
  startDate,
}: {
  frequency: MedicineWithRelations['frequency'];
  currentDate: Date;
  startDate: Date;
}): boolean => {
  if (!(frequency && currentDate && startDate)) {
    return false;
  }

  switch (frequency.type) {
    case 'EVERYDAY': {
      return true;
    }
    case 'EVERY_X_DAY': {
      const daysFromStart = differenceInCalendarDays(currentDate, startDate);
      const remainder = daysFromStart % frequency.everyXDay!;
      return remainder === 0;
    }
    case 'SPECIFIC_DAYS_OF_WEEK': {
      const dayOfWeek = format(currentDate, 'EEEE').toUpperCase() as DayOfWeek;
      return frequency.specificDaysOfWeek.includes(dayOfWeek);
    }
    case 'SPECIFIC_DAYS_OF_MONTH': {
      const dayOfMonth = getDate(currentDate);
      return frequency.specificDaysOfMonth.includes(dayOfMonth);
    }
    case 'ODD_EVEN_DAY': {
      const dayOfMonth = getDate(currentDate);
      return frequency.oddEvenDay!.isOddDay === (dayOfMonth % 2 === 1);
    }
    case 'ON_OFF_DAYS': {
      const daysFromStart = differenceInCalendarDays(currentDate, startDate);
      const remainder =
        daysFromStart % (frequency.onOffDays!.onDays + frequency.onOffDays!.offDays);
      return remainder < frequency.onOffDays!.onDays;
    }
  }
};
