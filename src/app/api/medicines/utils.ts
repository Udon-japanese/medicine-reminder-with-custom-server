import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import { DayOfWeek, FrequencyType, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { GetMedicineData } from './types';

type Stock =
  | {
      manageStock: true;
      quantity: number;
      autoConsume: boolean;
    }
  | {
      manageStock: false;
    };
type Frequency =
  | {
      type: 'EVERYDAY';
      everyday:
        | {
            hasWeekendIntakeTimes: true;
            weekends: DayOfWeek[];
            weekendIntakeTimes: { time: number; dosage: number }[];
          }
        | {
            hasWeekendIntakeTimes: false;
          };
    }
  | {
      type: 'EVERY_X_DAY';
      everyXDay: number;
    }
  | {
      type: 'SPECIFIC_DAYS_OF_WEEK';
      specificDaysOfWeek: DayOfWeek[];
    }
  | {
      type: 'SPECIFIC_DAYS_OF_MONTH';
      specificDaysOfMonth: number[];
    }
  | {
      type: 'ODD_EVEN_DAY';
      isOddDay: boolean;
    }
  | {
      type: 'ON_OFF_DAYS';
      onDays: number;
      offDays: number;
    }
  | null;

export function convertMedicineForm(form: MedicineForm) {
  const intakeTimes = form.intakeTimes.map((intakeTime) => ({
    time: convertMinutesAndDate(intakeTime.time),
    dosage: Number(intakeTime.dosage),
  }));

  const freqType = form?.frequency?.type;
  const frequency = getFrequency();

  const period = form.period?.hasDeadline
    ? { ...form.period, days: parseInt(form.period.days!, 10) }
    : form.period;

  const stock: Stock = form.stock.manageStock
    ? {
        manageStock: true,
        quantity: parseInt(form.stock.quantity),
        autoConsume: form.stock.autoConsume!,
      }
    : { manageStock: false };

  function getFrequency(): Frequency {
    switch (freqType) {
      case 'EVERYDAY':
        if (form.frequency!.everyday.hasWeekendIntakeTimes) {
          return {
            type: FrequencyType.EVERYDAY,
            everyday: {
              hasWeekendIntakeTimes: true,
              weekends: form.frequency!.everyday.weekends,
              weekendIntakeTimes: form.frequency!.everyday.weekendIntakeTimes.map(
                (intakeTime) => ({
                  time: convertMinutesAndDate(intakeTime.time),
                  dosage: Number(intakeTime.dosage),
                }),
              ),
            },
          };
        } else {
          return {
            type: FrequencyType.EVERYDAY,
            everyday: {
              hasWeekendIntakeTimes: false,
            },
          };
        }
      case 'EVERY_X_DAY':
        return {
          type: FrequencyType.EVERY_X_DAY,
          everyXDay: parseInt(form!.frequency!.everyXDay, 10),
        };
      case 'ON_OFF_DAYS':
        return {
          type: FrequencyType.ON_OFF_DAYS,
          onDays: parseInt(form!.frequency!.onDays, 10),
          offDays: parseInt(form!.frequency!.offDays, 10),
        };
      default:
        return form.frequency;
    }
  }

  return { ...form, intakeTimes, frequency, period, stock };
}

export function getCreateMedicineData({
  convertedMedicine,
  userId,
  imageId,
}: GetMedicineData) {
  const {
    name,
    intakeTimes,
    frequency,
    period,
    notify,
    unit,
    stock,
    memo: memoText,
  } = convertedMedicine;

  const data:
    | (Prisma.Without<Prisma.MedicineCreateInput, Prisma.MedicineUncheckedCreateInput> &
        Prisma.MedicineUncheckedCreateInput)
    | (Prisma.Without<Prisma.MedicineUncheckedCreateInput, Prisma.MedicineCreateInput> &
        Prisma.MedicineCreateInput) = {
    id: uuidv4(),
    name,
    intakeTimes: {
      create: intakeTimes,
    },
    unit,
    userId,
  };

  if (intakeTimes.length > 0) {
    createFrequencyData();
    data.period = {
      create: {
        startDate: period!.startDate,
        days: period?.hasDeadline ? period?.days : undefined,
      },
    };
    data.notify = notify;
  }

  if (stock.manageStock) {
    data.stock = {
      create: {
        quantity: stock.quantity,
        autoConsume: stock.autoConsume,
      },
    };
  }

  if (memoText || imageId) {
    data.memo = {
      create: {
        imageId,
        text: memoText,
      },
    };
  }

  return data;

  function createFrequencyData() {
    if (!frequency) return;

    const freqType = frequency.type;
    switch (freqType) {
      case 'EVERYDAY':
        if (frequency.everyday.hasWeekendIntakeTimes) {
          data.frequency = {
            create: {
              type: freqType,
              everyday: {
                create: {
                  weekends: frequency.everyday.weekends,
                  weekendIntakeTimes: {
                    create: frequency.everyday.weekendIntakeTimes,
                  },
                },
              },
            },
          };
        } else {
          data.frequency = {
            create: {
              type: freqType,
            },
          };
        }
        break;
      case 'EVERY_X_DAY':
        data.frequency = {
          create: { type: freqType, everyXDay: frequency.everyXDay },
        };
        break;
      case 'SPECIFIC_DAYS_OF_WEEK':
        data.frequency = {
          create: { type: freqType, specificDaysOfWeek: frequency.specificDaysOfWeek },
        };
        break;
      case 'SPECIFIC_DAYS_OF_MONTH':
        data.frequency = {
          create: {
            type: freqType,
            specificDaysOfMonth: frequency.specificDaysOfMonth,
          },
        };
        break;
      case 'ODD_EVEN_DAY':
        data.frequency = {
          create: {
            type: freqType,
            oddEvenDay: {
              create: { isOddDay: frequency.isOddDay },
            },
          },
        };
        break;
      case 'ON_OFF_DAYS':
        data.frequency = {
          create: {
            type: freqType,
            onOffDays: {
              create: {
                onDays: frequency.onDays,
                offDays: frequency.offDays,
              },
            },
          },
        };
        break;
    }
  }
}
