import { addHours, format, getYear, isDate } from 'date-fns';
import { isInvalidDate } from './isInvalidDate';

export const formatPeriod = (
  startDate: unknown | undefined,
  hasDeadline: unknown | undefined,
  days?: unknown | undefined,
) => {
  const isDaysValid =
    (typeof days === 'string' || typeof days === 'number') &&
    Number.isInteger(Number(days === '' ? NaN : days));
  if (typeof startDate === 'undefined' || typeof hasDeadline === 'undefined') {
    return '';
  }

  if (typeof hasDeadline !== 'boolean') {
    return '期限を設けるかどうか選択してください';
  }
  if (hasDeadline && typeof days === 'undefined') {
    return '';
  }
  if (!isDate(startDate) || isInvalidDate(startDate)) {
    return '無効な日付が入力されています';
  }
  if (hasDeadline && !isDaysValid) {
    return '無効な日数が入力されています';
  }

  const formattedStartDate = `${format(startDate, 'yyyy年M月d日')}〜`;

  if (!hasDeadline || !isDaysValid) {
    return formattedStartDate;
  }

  const numDays = typeof days === 'number' ? days : parseInt(days, 10);
  const endDate = addHours(startDate, 24 * numDays);
  const formattedEndDate = format(
    endDate,
    getYear(startDate) === getYear(endDate) ? 'M月d日' : 'yyyy年M月d日',
  );
  return `${formattedStartDate}${formattedEndDate}`;
};
