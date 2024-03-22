/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import styles from '@styles/components/dateTimePicker.module.scss';
import { TextFieldProps as MUITextFieldProps, useForkRef } from '@mui/material';

type TextFieldProps = MUITextFieldProps & {
  ownerState?: any;
};

export default function TextField(props: TextFieldProps) {
  const {
    id,
    label,
    InputProps: { ref: containerRef, startAdornment } = {},
    inputProps,
    error,
    focused,
    size,
    ref,
    defaultValue,
    ownerState,
    onClick,
    onBlur,
    value,
    className,
    ...other
  } = props;
  const handleRef = useForkRef(containerRef, ref);

  return (
    <span id={id} ref={handleRef}>
      {startAdornment}
      <input
        type='text'
        value={value as string}
        onClick={onClick}
        onBlur={onBlur}
        className={`${styles.field} ${className}`}
        {...inputProps}
        {...other}
      />
    </span>
  );
}
