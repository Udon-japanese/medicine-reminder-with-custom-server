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
  CalendarMonthOutlined,
  Notifications,
  NotificationsOff,
  PauseCircleFilled,
  SmsOutlined,
} from '@mui/icons-material';
import { DayOfWeek } from '@prisma/client';
import { MouseEventHandler, useState } from 'react';
import MemoImageModal from './MemoImageModal';
import { useRouter } from 'next/navigation';
import { getCurrentDateIntakeTimes } from '@/utils/getCurrentDateIntakeTimes';
import Image from 'next/image';

export default function MedicineItem({
  medicine,
}: {
  medicine: MedicineWithRelationsAndImageUrl;
}) {
  const router = useRouter();
  const now = new Date();
  const today = startOfDay(new Date());
  const [showMemoImageModal, setShowMemoImageModal] = useState(false);
  const { name, memo, stock, frequency, period, notify, isPaused, intakeTimes } =
    medicine;
  const currentDateIntakeTimes = getCurrentDateIntakeTimes({
    medicine,
    currentDate: today,
  });
  const { stockOutDateText, daysUntilStockOut } = getStockOutDate();
  const getStockStyle = () => {
    if (typeof daysUntilStockOut === 'undefined') return '';

    if (daysUntilStockOut <= 0) {
      return styles.stockOut;
    } else if (daysUntilStockOut <= 7) {
      return styles.stockWarning;
    } else {
      return '';
    }
  };

  const getFrequencyOptions = (freqType: FrequencyType) => {
    switch (freqType) {
      case 'EVERYDAY':
        return { intakeTimesLength: currentDateIntakeTimes.length };
      case 'EVERY_X_DAY':
        return { everyXDay: frequency!.everyXDay! };
      case 'SPECIFIC_DAYS_OF_WEEK':
        return { specificDaysOfWeek: frequency!.specificDaysOfWeek };
      case 'SPECIFIC_DAYS_OF_MONTH':
        return { specificDaysOfMonth: frequency!.specificDaysOfMonth };
      case 'ODD_EVEN_DAY':
        return { isOddDay: frequency!.oddEvenDay!.isOddDay };
      case 'ON_OFF_DAYS':
        return {
          onDays: frequency!.onOffDays!.onDays,
          offDays: frequency!.onOffDays!.offDays,
        };
      default:
        throw new Error(
          `無効な頻度のタイプが渡されました: ${freqType} typeof ${typeof freqType}`,
        );
    }
  };
  function getStockOutDate() {
    if (!stock?.quantity && stock?.quantity !== 0) {
      return {};
    }
    
    if (!(period && currentDateIntakeTimes?.length > 0 && frequency)) {
      return {};
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
      return {};
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

    let stockOutDateText = '';
    const differenceInDays = differenceInCalendarDays(currentDateFromToday, today);
    if (isSameDay(currentDateFromToday, today)) {
      stockOutDateText = '在庫切れ';
    } else if (differenceInDays <= 30) {
      stockOutDateText = `あと${differenceInDays}日`;
    } else {
      if (isSameYear(today, currentDateFromToday)) {
        stockOutDateText = format(currentDateFromToday, 'M月d日まで');
      } else {
        stockOutDateText = format(currentDateFromToday, 'yyyy年M月d日まで');
      }
    }

    return {
      stockOutDateText,
      daysUntilStockOut: differenceInDays,
    };
  }
  const handleClickImage: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setShowMemoImageModal(true);
  };
  const getIntakeTimesText = () => {
    const intakeTimesLength = currentDateIntakeTimes.length;
    const convertedIntakeTimes = currentDateIntakeTimes.map((intakeTime) =>
      format(convertMinutesAndDate(intakeTime.time), 'H:mm'),
    );
    if (currentDateIntakeTimes.length <= 3) {
      return convertedIntakeTimes.join(', ');
    } else {
      return `${convertedIntakeTimes[0]}～${convertedIntakeTimes[intakeTimesLength - 1]}${frequency?.type !== 'EVERYDAY' ? `の間に${intakeTimesLength}回` : ''}`;
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
            <div className={styles.pauseIconWrapper}>
              <PauseCircleFilled fontSize='inherit' />
            </div>
          </div>
        ) : (
          <>
            <div className={styles.medicineInfoContainer}>
              <div className={styles.name}>{name}</div>
              {intakeTimes.length > 0 && (
                <>
                  <div className={styles.medicineInfo}>
                    <div>
                      {getFrequencyText(
                        frequency!.type,
                        getFrequencyOptions(frequency!.type),
                      )}
                      {' - '}
                      {getIntakeTimesText()}
                    </div>
                  </div>
                  <div className={styles.medicineInfo}>
                    <CalendarMonthOutlined fontSize='inherit' />
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
              {memo?.text && (
                <div className={styles.medicineInfo}>
                  <SmsOutlined fontSize='inherit' />
                  <div>{memo.text}</div>
                </div>
              )}
              {stock && (
                <div className={`${styles.stockContainer} ${getStockStyle()}`}>
                  <div>
                    残り
                    {stock.quantity}
                    {medicine.unit}
                  </div>
                  {stockOutDateText && (
                    <div className={styles.stockOutDateText}>{stockOutDateText}</div>
                  )}
                </div>
              )}
            </div>
            <div className={styles.medicineImageNotifyContainer}>
              {memo?.imageUrl && (
                <button type='button' onClick={handleClickImage}>
                  <div className={styles.memoImageContainer}>
                    <Image
                      src={memo.imageUrl}
                      alt='メモ画像'
                      fill
                      sizes='50vw'
                      className={styles.memoImage}
                    />
                  </div>
                </button>
              )}
              {notify !== null && <NotifyIcon notify={notify} />}
            </div>
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
