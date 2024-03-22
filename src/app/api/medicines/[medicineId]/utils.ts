import { Prisma } from '@prisma/client';
import { GetMedicineData } from '../types';
import { MedicineWithRelations } from '@/types';

export async function getUpdateMedicineData({
  convertedMedicine,
  userId,
  imageId,
  existingMedicineId,
  existingMedicine,
}: GetMedicineData & {
  existingMedicineId: string;
  existingMedicine: MedicineWithRelations;
}) {
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
  const existingIntakeTimeIds = existingMedicine.intakeTimes.map(({ id }) => ({ id }));
  const existingWeekendIntakeTimeIds =
    existingMedicine.frequency?.everyday?.weekendIntakeTimes.map(({ id }) => ({ id }));

  const upsertIntakeTimes = intakeTimes.flatMap((intakeTime, index) => {
    const id = existingIntakeTimeIds[index]?.id;
    if (id) {
      return [
        {
          where: { id },
          update: intakeTime,
          create: intakeTime,
        },
      ];
    } else {
      return [];
    }
  });
  const createIntakeTimes = intakeTimes.slice(existingIntakeTimeIds.length);
  const deleteIntakeTimeIds = existingIntakeTimeIds
    .slice(intakeTimes.length)
    .map(({ id }) => ({ id }));

  const data:
    | (Prisma.Without<Prisma.MedicineUpdateInput, Prisma.MedicineUncheckedUpdateInput> &
        Prisma.MedicineUncheckedUpdateInput)
    | (Prisma.Without<Prisma.MedicineUncheckedUpdateInput, Prisma.MedicineUpdateInput> &
        Prisma.MedicineUpdateInput) = {
    name,
    intakeTimes: {
      upsert: upsertIntakeTimes,
      create: createIntakeTimes,
      deleteMany: deleteIntakeTimeIds,
    },
    unit,
    userId,
    updatedAt: new Date(),
  };

  if (intakeTimes.length > 0) {
    const periodData = {
      startDate: period!.startDate,
      days: period?.hasDeadline ? period?.days : undefined,
    };

    createFrequencyData();
    data.period = {
      upsert: {
        update: periodData,
        create: periodData,
      },
    };
    data.notify = notify;
  } else {
    if (existingMedicine.period) {
      data.period = {
        delete: { medicineId: existingMedicineId },
      };
    }
    if (existingMedicine.frequency) {
      data.frequency = {
        delete: { medicineId: existingMedicineId },
      };
    }

    data.notify = null;
  }

  if (stock.manageStock) {
    const stockData = {
      quantity: stock.quantity,
      autoConsume: stock.autoConsume,
    };

    data.stock = {
      upsert: {
        update: stockData,
        create: stockData,
      },
    };
  } else {
    if (existingMedicine.stock) {
      data.stock = {
        delete: { medicineId: existingMedicineId },
      };
    }
  }

  if (memoText || (imageId && typeof imageId === 'string')) {
    const memoData = {
      imageId,
      text: memoText,
    };

    data.memo = {
      upsert: {
        update: memoData,
        create: memoData,
      },
    };
  } else {
    if (existingMedicine.memo) {
      data.memo = {
        delete: { medicineId: existingMedicineId },
      };
    }
  }

  return data;

  async function createFrequencyData() {
    if (!frequency) return;

    const freqType = frequency.type;
    switch (freqType) {
      case 'EVERYDAY': {
        if (frequency.everyday.hasWeekendIntakeTimes) {
          const { weekends, weekendIntakeTimes } = frequency.everyday;
          const upsertWeekendIntakeTimes = weekendIntakeTimes?.flatMap(
            (intakeTime, index) => {
              const id = existingWeekendIntakeTimeIds?.[index]?.id;
              if (id) {
                return [
                  {
                    where: { id },
                    update: intakeTime,
                    create: intakeTime,
                  },
                ];
              } else {
                return [];
              }
            },
          );
          const createWeekendIntakeTimes = weekendIntakeTimes?.slice(
            existingWeekendIntakeTimeIds?.length,
          );
          const deleteWeekendIntakeTimeIds = existingIntakeTimeIds
            .slice(weekendIntakeTimes?.length)
            .map(({ id }) => ({ id }));

          const everydayUpdateData = {
            weekends,
            weekendIntakeTimes: {
              upsert: upsertWeekendIntakeTimes,
              create: createWeekendIntakeTimes,
              deleteMany: deleteWeekendIntakeTimeIds,
            },
          };
          const everydayCreateData = {
            weekends,
            weekendIntakeTimes: {
              create: weekendIntakeTimes,
            },
          };

          data.frequency = {
            upsert: {
              update: {
                type: freqType,
                everyday: {
                  upsert: {
                    update: everydayUpdateData,
                    create: everydayCreateData,
                  },
                },
              },
              create: {
                type: freqType,
                everyday: {
                  create: everydayCreateData,
                },
              },
            },
          };
        } else {
          if (existingMedicine.frequency?.everyday) {
            data.frequency = {
              upsert: {
                update: {
                  type: freqType,
                  everyday: {
                    delete: { frequencyId: existingMedicine.frequency?.id },
                  },
                },
                create: {
                  type: freqType,
                },
              },
            };
          } else {
            data.frequency = {
              upsert: {
                update: {
                  type: freqType,
                },
                create: {
                  type: freqType,
                },
              },
            };
          }
        }
        break;
      }
      case 'EVERY_X_DAY': {
        const freqData = {
          type: freqType,
          everyXDay: frequency.everyXDay,
        };
        data.frequency = {
          upsert: {
            update: freqData,
            create: freqData,
          },
        };
        break;
      }
      case 'SPECIFIC_DAYS_OF_WEEK': {
        const freqData = {
          type: freqType,
          specificDaysOfWeek: frequency.specificDaysOfWeek,
        };
        data.frequency = {
          upsert: {
            update: freqData,
            create: freqData,
          },
        };
        break;
      }
      case 'SPECIFIC_DAYS_OF_MONTH': {
        const freqData = {
          type: freqType,
          specificDaysOfMonth: frequency.specificDaysOfMonth,
        };
        data.frequency = {
          upsert: {
            update: freqData,
            create: freqData,
          },
        };
        break;
      }
      case 'ODD_EVEN_DAY':
        const oddEvenDayData = {
          isOddDay: frequency.isOddDay,
        };

        data.frequency = {
          upsert: {
            update: {
              type: freqType,
              oddEvenDay: {
                upsert: {
                  update: oddEvenDayData,
                  create: oddEvenDayData,
                },
              },
            },
            create: {
              type: freqType,
              oddEvenDay: {
                create: oddEvenDayData,
              },
            },
          },
        };
        break;
      case 'ON_OFF_DAYS':
        const onOffDaysData = {
          onDays: frequency.onDays,
          offDays: frequency.offDays,
        };
        data.frequency = {
          upsert: {
            update: {
              type: freqType,
              onOffDays: {
                upsert: {
                  update: onOffDaysData,
                  create: onOffDaysData,
                },
              },
            },
            create: {
              type: freqType,
              onOffDays: {
                create: onOffDaysData,
              },
            },
          },
        };
        break;
    }
  }
}
