import { z } from "zod";

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