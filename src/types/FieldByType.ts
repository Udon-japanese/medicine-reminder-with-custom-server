import { FieldPathValue, FieldValues, Path } from 'react-hook-form';

export type FieldByType<FormData extends FieldValues, T> = {
  [P in Path<FormData>]: T extends FieldPathValue<FormData, P> ? P : never;
}[Path<FormData>];
