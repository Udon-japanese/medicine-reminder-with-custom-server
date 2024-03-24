import { DayOfWeek, FrequencyType } from '@prisma/client';

const dayOfWeekMapping: { [key in DayOfWeek]: number } = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};
const reverseDayOfWeekMapping = Object.keys(dayOfWeekMapping).reduce(
  (acc, key) => {
    acc[dayOfWeekMapping[key as DayOfWeek]] = key as DayOfWeek;
    return acc;
  },
  {} as { [key: number]: DayOfWeek },
);
export const getConvertedSpecificDaysOfWeek = (
  specificDaysOfWeek: DayOfWeek[],
): string => {
  const numericDaysOfWeek = specificDaysOfWeek.map((d) => dayOfWeekMapping[d]);
  const ranges = getRanges(numericDaysOfWeek);
  const convertedSpecificDaysOfWeek = ranges.map((range) => {
    const [start, end] = range
      .split('～')
      .map((d) =>
        getDayOfWeekText(reverseDayOfWeekMapping[Number(d)]).replace('曜日', ''),
      );
    return !end || start === end ? start : `${start}～${end}`;
  });

  if (convertedSpecificDaysOfWeek.length === 0) {
    return '';
  } else {
    return convertedSpecificDaysOfWeek.join(', ');
  }
};

export function getFrequencyText(
  frequency: FrequencyType,
  options?: {
    intakeTimesLength?: number;
    everyXDay?: string | number;
    specificDaysOfWeek?: DayOfWeek[];
    specificDaysOfMonth?: number[];
    isOddDay?: boolean;
    onDays?: string | number;
    offDays?: string | number;
  },
) {
  switch (frequency) {
    case 'EVERYDAY':
      const intakeTimesLength = options?.intakeTimesLength;
      return intakeTimesLength ? `1日${options?.intakeTimesLength}回` : '毎日';
    case 'EVERY_X_DAY': {
      const everyXDay = options?.everyXDay;

      if (everyXDay && !Number.isNaN(Number(everyXDay))) {
        return `${everyXDay}日ごと`;
      } else {
        return 'X日ごと';
      }
    }
    case 'SPECIFIC_DAYS_OF_WEEK': {
      const specificDaysOfWeek = options?.specificDaysOfWeek;

      const isDayOfWeekArray = (array: unknown): array is DayOfWeek[] =>
        Array.isArray(array) &&
        array.every((item) => Object.values(DayOfWeek).includes(item));

      if (isDayOfWeekArray(specificDaysOfWeek)) {
        const convertedSpecificDaysOfWeek =
          getConvertedSpecificDaysOfWeek(specificDaysOfWeek);

        if (!convertedSpecificDaysOfWeek) {
          return '特定の曜日：未選択';
        } else {
          return convertedSpecificDaysOfWeek;
        }
      } else {
        return '特定の曜日';
      }
    }
    case 'SPECIFIC_DAYS_OF_MONTH': {
      const defaultText = '月の特定日';
      const specificDaysOfMonth = options?.specificDaysOfMonth;

      const isNumberArray = (array: unknown): array is number[] => {
        return Array.isArray(array) && array.every((item) => typeof item === 'number');
      };

      if (isNumberArray(specificDaysOfMonth)) {
        const ranges = getRanges(specificDaysOfMonth);

        if (specificDaysOfMonth.length === 0) {
          return `${defaultText}：未選択`;
        } else {
          const daysOfMonthLength = specificDaysOfMonth.length;
          if (ranges.length > 4) {
            return `${specificDaysOfMonth[0]}日～${specificDaysOfMonth[daysOfMonthLength - 1]}日まで、${daysOfMonthLength}日`;
          }
          return ranges.join(', ');
        }
      } else {
        return defaultText;
      }
    }
    case 'ODD_EVEN_DAY': {
      const isOddDay = options?.isOddDay;
      if (typeof isOddDay === 'boolean') {
        return isOddDay ? '奇数日' : '偶数日';
      } else {
        return '奇数日/偶数日';
      }
    }
    case 'ON_OFF_DAYS': {
      const onDays = options?.onDays;
      const offDays = options?.offDays;
      if (
        onDays &&
        offDays &&
        !Number.isNaN(Number(onDays)) &&
        !Number.isNaN(Number(offDays))
      ) {
        return `${onDays}日服用 ${offDays}日休薬`;
      } else {
        return 'X日服用 X日休薬';
      }
    }
    default:
      throw new Error(`無効な頻度の値が渡されました: ${frequency}`);
  }
}

function getRanges(array: number[]): string[] {
  const ranges = [];
  let start = array[0];
  let end = array[0];
  let count = 1;

  for (let i = 1; i < array.length; i++) {
    if (array[i] - end === 1) {
      end = array[i];
      count++;
    } else {
      if (count > 2) {
        ranges.push(`${start}～${end}`);
      } else {
        for (let j = start; j <= end; j++) {
          ranges.push(`${j}`);
        }
      }
      start = array[i];
      end = array[i];
      count = 1;
    }
  }

  if (count > 2) {
    ranges.push(`${start}～${end}`);
  } else if (count > 0) {
    for (let j = start; j <= end; j++) {
      ranges.push(`${j}`);
    }
  }

  return ranges;
}

export function getDayOfWeekText(dayOfWeek: DayOfWeek) {
  switch (dayOfWeek) {
    case 'MONDAY':
      return '月曜日';
    case 'TUESDAY':
      return '火曜日';
    case 'WEDNESDAY':
      return '水曜日';
    case 'THURSDAY':
      return '木曜日';
    case 'FRIDAY':
      return '金曜日';
    case 'SATURDAY':
      return '土曜日';
    case 'SUNDAY':
      return '日曜日';
    default:
      throw new Error(`無効な曜日の値が渡されました: ${dayOfWeek}`);
  }
}
