'use client';
import { ChangeEvent, InputHTMLAttributes } from 'react';
import { FieldValues, PathValue, useFormContext, useWatch } from 'react-hook-form';
import { FieldByType } from '@/types/FieldByType';
import styles from '@styles/components/input.module.scss';

type TextInputProps<T extends FieldValues> = {
  name: FieldByType<T, string>;
  max: number;
  error: string | undefined;
  label?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  displayOverflow?: boolean;
  displayErrMessage?: boolean;
  className?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'name' | 'maxLength' | 'max' | 'onBlur' | 'onChange'
>;

export default function TextInput<T extends FieldValues = never>({
  name,
  max,
  error,
  label,
  onBlur,
  onChange,
  className,
  displayOverflow = true,
  displayErrMessage = true,
  ...inputProps
}: TextInputProps<T>) {
  const { control, register, setValue, trigger } = useFormContext<T>();
  const watchedValue = useWatch({ control, name })?.trim();
  const setValueString = (name: FieldByType<T, string>, value: string) => {
    setValue(name, value as PathValue<T, FieldByType<T, string>>);
  };
  const isOverflow = watchedValue?.length > max;

  const handleChange = (val: string) => {
    const maxExtra = max + 20;
    if (val.trim().length > maxExtra) {
      val = val.slice(0, maxExtra);
    }

    setValueString(name, val);
  };
  const handleBlur = () => {
    trigger(name);
  };

  return (
    <div className={styles.inputContainer}>
      {label && (
        <div className={styles.labelContainer}>
          <label htmlFor={name} className={styles.label}>
            {label}
          </label>
        </div>
      )}
      <input
        {...register(name, {
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
              onChange(e);
            } else {
              handleChange(e.target.value);
            }
          },
          onBlur: (e: ChangeEvent<HTMLInputElement>) => {
            if (onBlur) {
              onBlur(e);
            } else {
              handleBlur();
            }
          },
        })}
        id={label ? name : undefined}
        type='text'
        autoComplete='off'
        {...inputProps}
        className={`${styles.input} ${error ? styles.isInvalid : styles.isValid} ${className}`}
      />
      {(error && displayErrMessage) || (isOverflow && displayOverflow) ? (
        <div className={styles.bottomMessageContainer}>
          {displayErrMessage && error && <div className={styles.errMessage}>{error}</div>}
          {isOverflow && displayOverflow && (
            <div className={styles.overflow}>{max - watchedValue?.length}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
