import { z } from 'zod';
import { dateSchema, dosageSchema } from '../schema';

export const medicineRecordFormSchema = z.object({
  intakeDate: dateSchema,
  medicines: z
    .array(
      z.object({
        medicineId: z.string().uuid(),
        medicineRecordId: z.number().int().positive().optional(),
        dosage: dosageSchema,
        isSelected: z.boolean(),
      }),
    )
    .refine((medicines) => medicines.some((medicine) => medicine.isSelected), {
      message: '1つ以上の薬を選択してください',
      path: ['medicines'],
    }),
});

export type MedicineRecordForm = z.infer<typeof medicineRecordFormSchema>;
