import { z } from 'zod';

export const userSettingFormSchema = z.object({
  notify: z.boolean(),
});

export type UserSettingForm = z.infer<typeof userSettingFormSchema>;