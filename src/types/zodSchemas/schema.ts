import { z } from 'zod';

const datelike = z.union([
  z.number({
    errorMap: (issue, { defaultError }) => {
      switch (issue.code) {
        case 'invalid_date':
          return { message: '無効な形式です' };
        case 'invalid_type':
          return { message: '無効な形式です' };
        default:
          return { message: defaultError };
      }
    },
  }),
  z.string(),
  z.date(),
]);
export const dateSchema = datelike.pipe(z.coerce.date());

export const dosageSchema = z
  .string()
  .refine((d) => !Number.isNaN(Number(d)), { message: '数値のみ入力できます' })
  .refine((d) => Number(d) > 0, {
    message: '服用量は0より大きい数値を入力してください',
  })
  .refine((d) => Number(d) <= 1000, {
    message: '服用量は1000以下の数値を入力してください',
  })
  .refine(
    (d) => {
      const decimalPart = d.split('.')[1];
      return decimalPart ? decimalPart.length <= 2 : true;
    },
    { message: '服用量は小数第二位まで入力できます' },
  );
