import { FieldValues, Path, get, useFormContext } from 'react-hook-form';

export default function useErrorMessage<T extends FieldValues>(...names: Path<T>[]) {
  const {
    formState: { errors },
  } = useFormContext<T>();
  const errMessages = names.map((name) => get(errors, name)?.message);
  return names.length === 1 ? errMessages[0] : errMessages;
}
