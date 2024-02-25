import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import { Prisma, DayOfWeek, FrequencyType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { isCloudinaryUrl } from '@/lib/cloudinary';

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
    dosage: parseFloat(intakeTime.dosage),
  }));

  const freqType = form?.frequency?.type;
  const frequency: Frequency =
    freqType === 'EVERY_X_DAY'
      ? {
          type: FrequencyType.EVERY_X_DAY,
          everyXDay: parseInt(form?.frequency?.everyXDay!, 10),
        }
      : freqType === 'ON_OFF_DAYS'
        ? {
            type: FrequencyType.ON_OFF_DAYS,
            onDays: parseInt(form?.frequency?.onDays!, 10),
            offDays: parseInt(form?.frequency?.offDays!, 10),
          }
        : form.frequency;

  const period = form.period?.hasDeadline
    ? { ...form.period, days: parseInt(form.period.days!, 10) }
    : form.period;

  const stock: Stock = form.stock.manageStock
    ? {
        manageStock: true,
        quantity: parseInt(form.stock.quantity),
        autoConsume: form.stock.autoConsume,
      }
    : { manageStock: false };

  return { ...form, intakeTimes, frequency, period, stock };
}

type ReturnTypeOfConvertMedicineForm = ReturnType<typeof convertMedicineForm>;

export function createMedicineData({
  convertedMedicineForm,
  userId,
  imageUrl,
}: {
  convertedMedicineForm: ReturnTypeOfConvertMedicineForm;
  userId: string;
  imageUrl: any;
}) {
  const { name, intakeTimes, frequency, period, notify, unit, stock, memo: memoText } = convertedMedicineForm;
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
    createPeriodData();
    data.notify = notify;
  }

  createMemoData();
  createStockData();

  return data;


  function createFrequencyData() {
    if (!frequency) return;

    const freqType = frequency.type;
    switch (freqType) {
      case 'EVERYDAY': 
        data.frequency = {
          create: {
            type: freqType,
          },
        };
        break;
      case 'EVERY_X_DAY': 
        data.frequency = {
          create: {
            type: freqType,
            everyXDay: frequency.everyXDay,
          },
        };
        break;
      case 'SPECIFIC_DAYS_OF_WEEK': 
        data.frequency = {
          create: {
            type: freqType,
            specificDaysOfWeek: frequency.specificDaysOfWeek,
          },
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
              create: {
                isOddDay: frequency.isOddDay,
              },
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
  function createPeriodData() {
    const startDate = period?.startDate;

    if (period?.hasDeadline) {
      data.period = {
        create: {
          startDate: startDate!,
          days: period?.days,
        },
      };
    } else {
      data.period = {
        create: {
          startDate: startDate!,
        },
      };
    }
  }
  function createStockData() {
    if (stock.manageStock) {
      data.stock = {
        create: {
          quantity: stock.quantity,
          autoConsume: stock.autoConsume,
        },
      };
    }
  }
  function createMemoData() {
    const isImageUrl = typeof imageUrl === 'string' && isCloudinaryUrl(imageUrl);

    if (memoText && isImageUrl) {
      data.memo = {
        create: {
          text: memoText,
          imageUrl,
        },
      };
    } else if (memoText) {
      data.memo = {
        create: {
          text: memoText,
        },
      };
    } else if (isImageUrl) {
      data.memo = {
        create: {
          imageUrl,
        },
      };
    }
  };
}
