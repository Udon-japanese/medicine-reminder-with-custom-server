import { MedicineWithRelations, MedicineWithRelationsAndImageUrl } from "@/types";
import { DayOfWeek } from "@prisma/client";
import { format } from "date-fns";

export const getCurrentDateIntakeTimes = ({
  medicine,
  currentDate,
}: {
  medicine: MedicineWithRelations | MedicineWithRelationsAndImageUrl;
  currentDate: Date;
}) => {
  if (medicine?.frequency?.type === 'EVERYDAY') {
    const everyday = medicine.frequency.everyday;

    if (everyday?.weekends?.length && everyday.weekendIntakeTimes?.length) {
      const { weekends, weekendIntakeTimes } = everyday;
      const dayOfWeek = format(currentDate, 'EEEE').toUpperCase() as DayOfWeek;

      if (weekends.includes(dayOfWeek)) {
        return weekendIntakeTimes;
      }
    }
  }

  return medicine.intakeTimes;
};
