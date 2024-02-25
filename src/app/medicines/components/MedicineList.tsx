'use client';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import { formatPeriod } from '@/utils/formatPeriod';
import { translateFrequencyToJapanese } from '@/utils/translateToJapanese';
import { FrequencyType, Prisma } from '@prisma/client';
import { format } from 'date-fns';
import Link from 'next/link';

type Medicine = Prisma.MedicineGetPayload<{
  include: {
    intakeTimes: true;
    frequency: {
      include: {
        oddEvenDay: true;
        onOffDays: true;
      };
    };
    period: true;
    stock: true;
    memo: true;
  };
}>;

export default function MedicineList({ medicines }: { medicines: Medicine[] }) {
  const getFrequencyOptions = (freqType: FrequencyType, med: Medicine) => {
    switch (freqType) {
      case 'EVERYDAY':
        return {};
      case 'EVERY_X_DAY':
        return { everyXDay: med.frequency?.everyXDay! };
      case 'SPECIFIC_DAYS_OF_WEEK':
        return { specificDaysOfWeek: med.frequency?.specificDaysOfWeek! };
      case 'SPECIFIC_DAYS_OF_MONTH':
        return { specificDaysOfMonth: med.frequency?.specificDaysOfMonth! };
      case 'ODD_EVEN_DAY':
        return { isOddDay: med.frequency?.oddEvenDay?.isOddDay! };
      case 'ON_OFF_DAYS':
        return {
          onDays: med.frequency?.onOffDays?.onDays!,
          offDays: med.frequency?.onOffDays?.offDays!,
        };
      default:
        throw new Error(
          `無効な頻度のタイプが渡されました: ${freqType} typeof ${typeof freqType}`,
        );
    }
  };

  if (medicines.length === 0) {
    <h1>登録されているお薬はありません</h1>;
  }

  return (
    <div>
      {medicines.map((med, i) => (
        <div key={i}>
          <h2>お薬名：{med.name}</h2>
          <br />
          <div>
            服用時間
            {med.intakeTimes.map((intakeTime) => (
              <div key={intakeTime.id}>
                <span>
                  {format(convertMinutesAndDate(intakeTime.time), 'H時m分')}
                  {intakeTime.dosage}
                  {med.unit}
                </span>
              </div>
            ))}
          </div>
          <br />
          <p>
            頻度{' '}
            {translateFrequencyToJapanese(
              med.frequency?.type!,
              getFrequencyOptions(med.frequency?.type!, med),
            )}
          </p>
          <br />
          <div>
            期間：
            {formatPeriod(med.period?.startDate, !!med.period?.days, med.period?.days)}
          </div>
          <br />
          <div>通知を{med.notify ? '送る' : '送らない'}</div>
          <br />
          <div>
            在庫
            {!med.stock ? (
              <div>在庫を設定しない</div>
            ) : (
              <>
                <div>在庫の数：{med.stock?.quantity}</div>
                <div>
                  通知が来たら自動消費{med?.stock?.autoConsume ? 'する' : 'しない'}
                </div>
              </>
            )}
          </div>
          <br />
          <div>
            メモ
            <div>{med.memo?.text}</div>
            {med.memo?.imageUrl && <img src={med.memo?.imageUrl} alt='がぞー' />}
          </div>
          <Link href={`/medicines/edit/${med.id}`}>編集</Link>
        </div>
      ))}
    </div>
  );
}
