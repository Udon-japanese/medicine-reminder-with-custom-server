import styles from '@styles/components/dateTimePicker.module.scss';
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
  UseDateFieldProps,
} from '@mui/x-date-pickers';
import { Dispatch, SetStateAction } from 'react';

interface ButtonFieldProps
  extends UseDateFieldProps<Date>,
    BaseSingleInputFieldProps<Date | null, Date, FieldSection, DateValidationError> {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function ButtonField(props: ButtonFieldProps) {
  const {
    setOpen,
    label,
    id,
    disabled,
    className,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <button
      type='button'
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      className={`${styles.field} ${className}`}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      {label ? label : '日付を選択'}
    </button>
  );
}
