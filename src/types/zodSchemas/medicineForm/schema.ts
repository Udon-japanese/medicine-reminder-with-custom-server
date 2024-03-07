import { z } from 'zod';
import { FrequencyType, DayOfWeek } from '@prisma/client';
import {
  getDuplicateDateIndexes,
  getDuplicateStringIndexes,
  getEmptyStringIndexes,
} from './utils';
import { dateSchema } from '../schema';

const stockSchema = z.discriminatedUnion('manageStock', [
  z.object({
    manageStock: z.literal(true),
    quantity: z
      .string()
      .refine((s) => Number.isInteger(Number(s)), { message: '無効な在庫数です' })
      .refine((s) => s && Number(s) >= 0, {
        message: '在庫数は0以上の数値を入力してください',
      })
      .refine((s) => Number(s) <= 1000, {
        message: '在庫数は1000以下の数値を入力してください',
      }),
    autoConsume: z.boolean({
      invalid_type_error: '自動消費するかどうかを設定してください',
    }),
  }),
  z.object({
    manageStock: z.literal(false),
  }),
]);

const intakeTimesSchema = z.array(
  z.object({
    time: dateSchema,
    dosage: z
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
      ),
  }),
);

const periodSchema = z.discriminatedUnion('hasDeadline', [
  z.object({
    hasDeadline: z.literal(true),
    startDate: dateSchema,
    days: z
      .string()
      .optional()
      .refine((d) => Number.isInteger(Number(d)), { message: '無効な日数です' })
      .refine((d) => Number(d) >= 1, { message: '日数は1以上の数値を入力してください' })
      .refine((d) => Number(d) <= 1000, { message: '期限は1000日まで入力できます' }),
  }),
  z.object({
    hasDeadline: z.literal(false),
    startDate: dateSchema,
  }),
]);

const onOffDaysSchema = z
  .string()
  .refine((o) => Number.isInteger(Number(o)), { message: '無効な日数です' })
  .refine((o) => Number(o) >= 1, { message: '日数は1以上の数値を入力してください' })
  .refine((o) => Number(o) <= 200, { message: '日数は200以下の数値を入力してください' });
const frequencySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(FrequencyType.EVERYDAY),
  }),
  z.object({
    type: z.literal(FrequencyType.EVERY_X_DAY),
    everyXDay: z
      .string()
      .refine((e) => Number.isInteger(Number(e)), { message: '無効な日数です' })
      .refine((e) => Number(e) >= 2, { message: '日数は2以上の数値を入力してください' })
      .refine((e) => Number(e) <= 100, {
        message: '日数は100以下の数値を入力してください',
      }),
  }),
  z.object({
    type: z.literal(FrequencyType.SPECIFIC_DAYS_OF_WEEK),
    specificDaysOfWeek: z
      .array(z.nativeEnum(DayOfWeek), {
        invalid_type_error: '曜日を１つ以上選択してください',
      })
      .min(1, '曜日を１つ以上選択してください')
      .max(7)
      .refine((daysOfWeek) => new Set(daysOfWeek).size === daysOfWeek.length, {
        message: '同じ曜日は複数回選択できません',
      }),
  }),
  z.object({
    type: z.literal(FrequencyType.SPECIFIC_DAYS_OF_MONTH),
    specificDaysOfMonth: z
      .array(
        z
          .number({ invalid_type_error: '無効な日数です' })
          .int('無効な日数です')
          .min(1, '日数は1以上の数値を入力してください')
          .max(31, '日数は31以上の数値を入力してください'),
        { invalid_type_error: '日付を１つ以上選択してください' },
      )
      .min(1, '日付を1つ以上選択してください')
      .max(31)
      .refine((daysOfMonth) => new Set(daysOfMonth).size === daysOfMonth.length, {
        message: '同じ日付を複数回選択することはできません',
      }),
  }),
  z.object({
    type: z.literal(FrequencyType.ODD_EVEN_DAY),
    isOddDay: z.boolean({ invalid_type_error: '奇数日か偶数日を選択してください' }),
  }),
  z.object({
    type: z.literal(FrequencyType.ON_OFF_DAYS),
    onDays: onOffDaysSchema,
    offDays: onOffDaysSchema,
  }),
]);

export const medicineFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'お薬名を入力してください')
      .max(30, 'お薬名は30文字まで入力できます'),
    intakeTimes: intakeTimesSchema,
    frequency: frequencySchema.nullable(),
    period: periodSchema.nullable(),
    notify: z
      .boolean({ invalid_type_error: '通知を送るかどうかを設定してください' })
      .nullable(),
    unit: z
      .string()
      .trim()
      .min(1, '単位を設定してください')
      .max(10, '10文字以内の単位のみ設定できます'),
    stock: stockSchema,
    memo: z.string().trim().max(255, 'メモは255文字まで入力できます').optional(),
  })
  .refine(
    ({ intakeTimes, frequency, notify, period }) => {
      if (intakeTimes.length === 0) return true;

      return frequency !== null && notify !== null && period !== null;
    },
    {
      message: '服用時間を設定する場合、頻度・期間・通知設定も入力してください',
      path: ['frequency', 'notify', 'period'],
    },
  )
  .superRefine((value, ctx) => {
    getDuplicateDateIndexes(value.intakeTimes?.map((t) => t.time)).forEach((index) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '時間が重複しています',
        path: ['intakeTimes', index, 'time'],
      });
    });
  });
export type MedicineForm = z.infer<typeof medicineFormSchema>;

export const medicineUnitFormSchema = z
  .object({
    units: z.array(
      z.object({
        unit: z
          .string()
          .trim()
          .min(1, '単位を入力してください')
          .max(10, '単位は10文字まで入力できます'),
      }),
    ),
  })
  .superRefine((value, ctx) => {
    getDuplicateStringIndexes(value.units.map((u) => u.unit)).forEach((index) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '単位が重複しています',
        path: ['units', index, 'unit'],
      });
    });
  })
  .superRefine((value, ctx) => {
    getEmptyStringIndexes(value.units.map((u) => u.unit)).forEach((index) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '単位を入力してください',
        path: ['units', index, 'unit'],
      });
    });
  });
export type MedicineUnitForm = z.infer<typeof medicineUnitFormSchema>;
