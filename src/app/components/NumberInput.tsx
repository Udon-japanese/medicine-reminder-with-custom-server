'use client';
import { ChangeEvent, InputHTMLAttributes } from 'react';
import { FieldValues, PathValue, useFormContext } from 'react-hook-form';
import { FieldByType } from '@/types/FieldByType';
import styles from '@styles/components/input.module.scss';

type Props<T extends FieldValues> = {
  name: FieldByType<T, string>;
  max: number;
  min?: number;
  error: string | undefined;
  decimalPlaces?: number;
  className?: string;
  label?: string;
  format?: string;
  displayErrMessage?: boolean;
  disableStyles?: boolean;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'name' | 'maxLength' | 'max' | 'min' | 'minLength'
>;

export default function NumberInput<T extends FieldValues = never>({
  name,
  max,
  min = 0,
  error,
  decimalPlaces = 0,
  className,
  label,
  format,
  displayErrMessage = true,
  disableStyles = false,
  ...inputProps
}: Props<T>) {
  const { register, setValue, trigger } = useFormContext<T>();
  const regexSinglePeriod: RegExp = /^[^.]*\.[^.]*$/;

  const setValueNumber = (name: FieldByType<T, string>, value: string) => {
    setValue(name, value as PathValue<T, FieldByType<T, string>>);
  };
  const truncateNumber = (num: number) => {
    const power = Math.pow(10, decimalPlaces);
    return Math.floor(num * power) / power;
  };
  const toHalfWidth = (val: string): string => {
    return typeof val === 'string'
      ? val
          .replace(/[．。]/g, '.')
          .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      : '';
  };
  const handleChange = (val: string) => {
    const v = toHalfWidth(val);
    let numVal = v.trim() === '' ? NaN : Number(v);

    if (regexSinglePeriod.test(v)) {
      const decimalPart = v.split('.')[1];
      if (
        !Number.isNaN(numVal) &&
        (decimalPart?.length > decimalPlaces || decimalPlaces === 0)
      ) {
        numVal = truncateNumber(numVal);
        setValueNumber(name, `${numVal}`);
        return;
      }
    }

    if (!Number.isNaN(numVal)) {
      if (numVal > max) {
        setValueNumber(name, `${max}`);
        return;
      }
      if (numVal < min) {
        setValueNumber(name, `${min}`);
        return;
      }

      setValueNumber(name, v);
    }
  };
  const handleBlur = (val: string) => {
    const numVal = val.trim() === '' ? NaN : Number(val);
    if (!Number.isNaN(numVal)) {
      setValueNumber(name, numVal || numVal === 0 ? `${numVal}` : '');
    }
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
            handleChange(e.target.value);
          },
          onBlur: (e: ChangeEvent<HTMLInputElement>) => {
            handleBlur(e.target.value);
          },
        })}
        type='text'
        inputMode='numeric'
        autoComplete='off'
        id={label ? name : undefined}
        {...inputProps}
        className={`${disableStyles ? '' : styles.input} ${error ? styles.isInvalid : styles.isValid} ${className}`}
      />
      {(error && displayErrMessage) || format ? (
        <div className={styles.bottomMessageContainer}>
          {displayErrMessage && error && (
            <div className={styles.errMessage}>{error}</div>
          )}
          {format && <div className={styles.numberFormat}>{format}</div>}
        </div>
      ) : null}
    </div>
  );
}
