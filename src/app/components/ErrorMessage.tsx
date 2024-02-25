import { ErrorMessage as BaseErrorMessage } from '@hookform/error-message';
import {

  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form';

interface Props<T extends FieldValues = never> {
  name: Path<T>;
  className?: string;
}

export default function ErrorMessage<T extends FieldValues>({
  className = '',
  name,
}: Props<T>) {
  const {
    formState: { errors },
  } = useFormContext<T>();

  return (
    <BaseErrorMessage
      name={name as any}
      errors={errors}
      render={({ messages, message }) => {
        const errors = message ? [message] : messages;
        return (
          errors && (
            <span className={`${className}`}>
              {Object.entries(errors).map(([type, message]) => (
                <span key={type}>{message}</span>
              ))}
            </span>
          )
        );
      }}
    />
  );
}
