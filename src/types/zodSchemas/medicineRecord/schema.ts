import { z } from 'zod';
import { dateSchema } from '../schema';

export const medicineRecordFormSchema = z.object({
  intakeTime: z.number().int().min(0).max(1439),
  intakeDate: dateSchema,
  intakenMedicines: z.array(
    z.object({
      medicineId: z.string().uuid(),
      dosage: z
        .number({ invalid_type_error: '数値のみ入力できます' })
        .positive('服用量は0より大きい数値を入力してください')
        .max(1000, '服用量は1000以下の数値を入力してください')
        .refine(
          (d) => {
            const decimalPart = d.toString().split('.')[1];
            return decimalPart ? decimalPart.length <= 2 : true;
          },
          { message: '服用量は小数第二位まで入力できます' },
        ),
      isIntaken: z.boolean(),
    }),
  ),
});

export type MedicineRecordForm = z.infer<typeof medicineRecordFormSchema>;
