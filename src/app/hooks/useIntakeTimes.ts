import {
  MedicineWithDosage,
  MedicineWithDosageAndRecord,
  MedicineWithRelations,
} from '@/types';
import isCurrentMedicine from '@/utils/isCurrentMedicine';
import { isIntakeDate } from '@/utils/isIntakeDate';
import { MedicineRecord } from '@prisma/client';
import { addDays, isAfter, isSameDay, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Status =
  | 'no-completed'
  | 'some-completed'
  | 'all-completed'
  | 'no-intake-times'
  | 'future';

export default function useIntakeTimes({
  currentDate,
  existingMedicines,
  medicineRecords,
}: {
  currentDate: Date;
  existingMedicines: MedicineWithRelations[];
  medicineRecords: MedicineRecord[];
}): {
  pendingTimes: [number, MedicineWithDosage[]][];
  completedTimes: [number, MedicineWithDosageAndRecord[]][];
  skippedTimes: [number, MedicineWithDosageAndRecord[]][];
  scheduledMedicines: MedicineWithRelations[];
  getMedicinesStatus: () => Status;
} {
  const [pendingTimes, setPendingTimes] = useState<[number, MedicineWithDosage[]][]>([]);
  const [completedTimes, setCompletedTimes] = useState<
    [number, MedicineWithDosageAndRecord[]][]
  >([]);
  const [skippedTimes, setSkippedTimes] = useState<
    [number, MedicineWithDosageAndRecord[]][]
  >([]);
  const [scheduledMedicines, setScheduledMedicines] = useState<MedicineWithRelations[]>(
    [],
  );
  const currentMedicines = useMemo(
    () =>
      existingMedicines.filter((m) =>
        isCurrentMedicine({ period: m?.period, frequency: m?.frequency, currentDate }),
      ),
    [currentDate, existingMedicines],
  );
  const currentMedicineRecords = useMemo(
    () =>
      medicineRecords.filter((r) => {
        if (r?.scheduledIntakeDate) {
          return isSameDay(r.scheduledIntakeDate, currentDate);
        } else {
          return isSameDay(r.actualIntakeDate, currentDate);
        }
      }),
    [currentDate, medicineRecords],
  );

  const sortMapEntriesByKey = <T, U>(map: Map<T, U[]>): [T, U[]][] => {
    return [...map.entries()].sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });
  };
  const getMedicinesStatus = useCallback((): Status => {
    const pLength = pendingTimes.length;
    const cLength = completedTimes.length;
    const sLength = skippedTimes.length;
    const allTimesLength = pLength + cLength + sLength;
    const now = startOfDay(new Date());
    const currDate = startOfDay(currentDate);

    if (allTimesLength === 0) {
      return 'no-intake-times';
    }

    if (isAfter(currDate, now)) {
      return 'future';
    }

    if (allTimesLength === cLength + sLength && pLength === 0) {
      return 'all-completed';
    }

    if (cLength > 0 || sLength > 0) {
      return 'some-completed';
    }

    if (allTimesLength === pLength) {
      return 'no-completed';
    }

    return 'no-intake-times';
  }, [pendingTimes, completedTimes, skippedTimes, currentDate]);

  useEffect(() => {
    const pendingTimesMap = new Map<number, MedicineWithDosage[]>();
    const completedTimesMap = new Map<number, MedicineWithDosageAndRecord[]>();
    const skippedTimesMap = new Map<number, MedicineWithDosageAndRecord[]>();

    for (const record of currentMedicineRecords) {
      const medicine = existingMedicines.find((m) => m.id === record.medicineId);
      if (!medicine) continue;

      const medicineWithDosage = { dosage: record.dosage, medicine, record };

      if (record.isCompleted) {
        if (!completedTimesMap.has(record.actualIntakeTime)) {
          completedTimesMap.set(record.actualIntakeTime, []);
        }
        completedTimesMap.get(record.actualIntakeTime)?.push(medicineWithDosage);
      } else if (record.isSkipped) {
        if (!skippedTimesMap.has(record.actualIntakeTime)) {
          skippedTimesMap.set(record.actualIntakeTime, []);
        }
        skippedTimesMap.get(record.actualIntakeTime)?.push(medicineWithDosage);
      }
    }

    const scheduledMedicines = currentMedicines.filter((medicine) => {
      if (medicine.isPaused) return false;

      if (medicine.intakeTimes.length === 0) {
        return false;
      }

      const startOfCurrentDay = startOfDay(currentDate);
      const startDate = medicine.period!.startDate;
      const days = medicine.period?.days;

      if (days && days > 0 && addDays(startDate, days) < startOfCurrentDay) {
        return false;
      }

      return isIntakeDate({
        frequency: medicine.frequency,
        currentDate,
        startDate,
      });
    });

    scheduledMedicines.forEach((medicine) => {
      medicine.intakeTimes.forEach((intake) => {
        const scheduledIntakeTime = intake.time;
        if (!pendingTimesMap.has(scheduledIntakeTime)) {
          pendingTimesMap.set(scheduledIntakeTime, []);
        }
        pendingTimesMap
          ?.get(scheduledIntakeTime)
          ?.push({ medicine, dosage: intake.dosage });
      });
    });

    completedTimesMap.forEach((medsWithDosage) => {
      medsWithDosage.forEach((medWithDosage) => {
        const scheduledIntakeTime = medWithDosage.record.scheduledIntakeTime;
        if (scheduledIntakeTime === null) return;

        let pendingMedsWithDosage = pendingTimesMap.get(scheduledIntakeTime);
        if (!pendingMedsWithDosage) return;

        pendingMedsWithDosage = pendingMedsWithDosage.filter(
          (m) => m.medicine.id !== medWithDosage.medicine.id,
        );

        if (pendingMedsWithDosage.length === 0) {
          pendingTimesMap.delete(scheduledIntakeTime);
        } else {
          pendingTimesMap.set(scheduledIntakeTime, pendingMedsWithDosage);
        }
      });
    });

    skippedTimesMap.forEach((medsWithDosage) => {
      medsWithDosage.forEach((medWithDosage) => {
        const scheduledIntakeTime = medWithDosage.record.scheduledIntakeTime;
        if (scheduledIntakeTime === null) return;

        let pendingMedsWithDosage = pendingTimesMap.get(scheduledIntakeTime);
        if (!pendingMedsWithDosage) return;

        pendingMedsWithDosage = pendingMedsWithDosage.filter(
          (m) => m.medicine.id !== medWithDosage.medicine.id,
        );

        if (pendingMedsWithDosage.length === 0) {
          pendingTimesMap.delete(scheduledIntakeTime);
        } else {
          pendingTimesMap.set(scheduledIntakeTime, pendingMedsWithDosage);
        }
      });
    });

    setPendingTimes(sortMapEntriesByKey(pendingTimesMap));
    setCompletedTimes(sortMapEntriesByKey(completedTimesMap));
    setSkippedTimes(sortMapEntriesByKey(skippedTimesMap));
    setScheduledMedicines(scheduledMedicines);
  }, [
    currentDate,
    existingMedicines,
    medicineRecords,
    currentMedicineRecords,
    currentMedicines,
  ]);

  return {
    pendingTimes,
    completedTimes,
    skippedTimes,
    scheduledMedicines,
    getMedicinesStatus,
  };
}
