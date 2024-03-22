'use client';
import { MedicineWithRelationsAndImageUrl } from '@/types';
import { FrequencyType } from '@prisma/client';
import styles from '@styles/components/medicines/medicineItem/index.module.scss';
import {
  addDays,
  addMinutes,
  differenceInCalendarDays,
  format,
  getDate,
  isAfter,
  isSameDay,
  isSameYear,
  startOfDay,
} from 'date-fns';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import { getFrequencyText } from '@/utils/getMedicineText';
import { formatPeriod } from '@/utils/formatPeriod';
import {
  EventBusy,
  Notifications,
  NotificationsOff,
  PauseCircleFilled,
} from '@mui/icons-material';
import { DayOfWeek } from '@prisma/client';
import { useState } from 'react';
import Memo from './Memo';
import MemoImageModal from './MemoImageModal';
import { useRouter } from 'next/navigation';
import { getCurrentDateIntakeTimes } from '@/utils/getCurrentDateIntakeTimes';

export default function MedicineItem({
  medicine,
}: {
  medicine: MedicineWithRelationsAndImageUrl;
}) {
  const router = useRouter();
  const [showMemoImageModal, setShowMemoImageModal] = useState(false);
  const { name, memo, stock, frequency, period, notify, isPaused } = medicine;
  const intakeTimes = medicine.intakeTimes.sort((a, b) => a.time - b.time);
  const stockText = getStockOutDate();

  const getFrequencyOptions = (
    freqType: FrequencyType,
    med: MedicineWithRelationsAndImageUrl,
  ) => {
    switch (freqType) {
      case 'EVERYDAY':
        return {};
      case 'EVERY_X_DAY':
        return { everyXDay: med.frequency!.everyXDay! };
      case 'SPECIFIC_DAYS_OF_WEEK':
        return { specificDaysOfWeek: med.frequency!.specificDaysOfWeek };
      case 'SPECIFIC_DAYS_OF_MONTH':
        return { specificDaysOfMonth: med.frequency!.specificDaysOfMonth };
      case 'ODD_EVEN_DAY':
        return { isOddDay: med.frequency!.oddEvenDay!.isOddDay };
      case 'ON_OFF_DAYS':
        return {
          onDays: med.frequency!.onOffDays!.onDays,
          offDays: med.frequency!.onOffDays!.offDays,
        };
      default:
        throw new Error(
          `無効な頻度のタイプが渡されました: ${freqType} typeof ${typeof freqType}`,
        );
    }
  };
  function getStockOutDate() {
    const now = new Date();
    const today = startOfDay(new Date());
    const currentDateIntakeTimes = getCurrentDateIntakeTimes({medicine, currentDate: today});
    if (!(period && currentDateIntakeTimes?.length > 0 && stock?.quantity && frequency)) {
      return '';
    }

    const startDate = startOfDay(period.startDate);
    const days = period.days || 0;

    const getDosageBasedOnFrequency = (dailyDosage: number) => {
      switch (frequency.type) {
        case 'EVERYDAY': {
          return dailyDosage;
        }
        case 'EVERY_X_DAY': {
          const daysFromStart = differenceInCalendarDays(currentDateFromToday, startDate);
          const remainder = daysFromStart % frequency.everyXDay!;
          return remainder === 0 ? dailyDosage : 0;
        }
        case 'SPECIFIC_DAYS_OF_WEEK': {
          const dayOfWeek = format(
            currentDateFromToday,
            'EEEE',
          ).toUpperCase() as DayOfWeek;
          return frequency!.specificDaysOfWeek.includes(dayOfWeek) ? dailyDosage : 0;
        }
        case 'SPECIFIC_DAYS_OF_MONTH': {
          const dayOfMonth = getDate(currentDateFromToday);
          return frequency!.specificDaysOfMonth.includes(dayOfMonth) ? dailyDosage : 0;
        }
        case 'ODD_EVEN_DAY': {
          const dayOfMonth = getDate(currentDateFromToday);
          return frequency!.oddEvenDay!.isOddDay === (dayOfMonth % 2 === 1)
            ? dailyDosage
            : 0;
        }
        case 'ON_OFF_DAYS': {
          const daysFromStart = differenceInCalendarDays(currentDateFromToday, startDate);
          const remainder =
            daysFromStart %
            (frequency!.onOffDays!.onDays + frequency!.onOffDays!.offDays);
          return remainder < frequency!.onOffDays!.onDays ? dailyDosage : 0;
        }
      }
    };

    if (isAfter(today, addDays(startDate, days)) && days) {
      return '';
    }

    let currentDateFromToday = today;
    let remainingStock = stock.quantity;

    while (remainingStock > 0) {
      const dailyDosage = currentDateIntakeTimes
        .filter((intake) => addMinutes(currentDateFromToday, intake.time) > now)
        .reduce((total, intake) => total + intake.dosage, 0);

      remainingStock -= getDosageBasedOnFrequency(dailyDosage);
      if (remainingStock <= 0) break;

      currentDateFromToday = addDays(currentDateFromToday, 1);
    }

    const differenceInDays = differenceInCalendarDays(currentDateFromToday, today);
    if (isSameDay(currentDateFromToday, today)) {
      return '在庫切れ';
    } else if (differenceInDays <= 30) {
      return `残り${differenceInDays}日`;
    } else {
      if (isSameYear(today, currentDateFromToday)) {
        return format(currentDateFromToday, 'M月d日');
      } else {
        return format(currentDateFromToday, 'yyyy年M月d日');
      }
    }
  };

  return (
    <>
      <div
        className={styles.item}
        onClick={() => router.push(`/medicines/edit/${medicine.id}`)}
      >
        {isPaused ? (
          <div className={styles.pausedContainer}>
            <div className={styles.pausedName}>{name}</div>
            <div className={styles.pauseWrapper}>
              <PauseCircleFilled fontSize='inherit' />
            </div>
          </div>
        ) : (
          <>
            <div className={styles.medicineInfo}>
              <div className={styles.name}>{name}</div>
              {intakeTimes.length > 0 && (
                <>
                  <div className={styles.infoContainer}>
                    <div className={styles.infoLabel}>時間</div>
                    <div className={styles.intakeTimesContainer}>
                      {intakeTimes.map((intakeTime, i) => (
                        <div key={i} className={styles.intakeTime}>
                          {format(convertMinutesAndDate(intakeTime.time), 'H:mm')}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.infoContainer}>
                    <div className={styles.infoLabel}>頻度</div>
                    <div className={styles.frequency}>
                      {getFrequencyText(
                        frequency!.type,
                        getFrequencyOptions(frequency!.type, medicine),
                      )}
                    </div>
                  </div>
                  <div className={styles.infoContainer}>
                    <div className={styles.infoLabel}>期間</div>
                    <div>
                      {formatPeriod({
                        startDate: period?.startDate,
                        hasDeadline: !!period?.days,
                        days: period?.days,
                      })}
                    </div>
                  </div>
                </>
              )}
              {stock && (
                <div className={styles.infoContainer}>
                  <div className={styles.infoLabel}>在庫</div>
                  <div>
                    {stock.quantity}
                    {medicine.unit}
                  </div>
                  {intakeTimes.length > 0 && stockText && (
                    <div className={styles.exhaustionDate}>
                      <EventBusy fontSize='small' />
                      {stockText}
                    </div>
                  )}
                </div>
              )}
              {memo && <Memo memo={memo} setShowModal={setShowMemoImageModal} />}
            </div>
            {notify !== null && (
              <div className={styles.notifyContainer}>
                <NotifyIcon notify={notify} />
              </div>
            )}
          </>
        )}
      </div>
      <MemoImageModal
        showMemoImageModal={showMemoImageModal}
        setShowMemoImageModal={setShowMemoImageModal}
        memo={memo}
      />
    </>
  );
}

function NotifyIcon({ notify }: { notify: boolean }) {
  return (
    <div
      className={`${styles.notifyWrapper} ${notify ? styles.isNotify : styles.isNotNotify}`}
    >
      {notify ? (
        <Notifications fontSize='inherit' />
      ) : (
        <NotificationsOff fontSize='inherit' />
      )}
    </div>
  );
}
