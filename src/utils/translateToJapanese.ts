import { DayOfWeek, FrequencyType } from '@prisma/client';

export function translateFrequencyToJapanese(
  frequency: FrequencyType,
  options?: {
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
      return '毎日';
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

      const isDayOfWeekArray = (array: any): array is DayOfWeek[] => {
        return Array.isArray(array) && array.every(item => Object.values(DayOfWeek).includes(item));
      }
      
      if (isDayOfWeekArray(specificDaysOfWeek)) {
        const translatedSpecificDaysOfMonth = specificDaysOfWeek?.map((item) =>
          translateDayOfWeekToJapanese(item),
        );
        if (translatedSpecificDaysOfMonth.length === 0) {
          return '特定の曜日：未選択';
        } else {
          return translatedSpecificDaysOfMonth.join(' ');
        }
      } else {
        return '特定の曜日';
      }
    }
    case 'SPECIFIC_DAYS_OF_MONTH': {
      const defaultText = '月の特定日';
      const specificDaysOfMonth = options?.specificDaysOfMonth;

      const isNumberArray = (array: any): array is number[] => {
        return Array.isArray(array) && array.every(item => typeof item === 'number');
      }      

      if (isNumberArray(specificDaysOfMonth)) {
        if (specificDaysOfMonth.length === 0) {
          return '月の特定日：未選択';
        } else {
          return `${defaultText}：${specificDaysOfMonth.join(' ')}`;
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
      if (onDays && offDays && !Number.isNaN(Number(onDays)) && !Number.isNaN(Number(offDays))) {
        return `${onDays}日服用 ${offDays}日休薬`;
      } else {
        return 'X日服用 X日休薬';
      }
    }
    default:
      throw new Error(`無効な頻度の値が渡されました: ${frequency}`);
  }
}

export function translateDayOfWeekToJapanese(dayOfWeek: DayOfWeek) {
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
