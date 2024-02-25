'use client';
import { ChangeEvent, InputHTMLAttributes } from 'react';
import { FieldValues, PathValue, useFormContext } from 'react-hook-form';
import { FieldByType } from '@/types/FieldByType';

type Props<T extends FieldValues> = {
  name: FieldByType<T, string>;
  max: number;
  min?: number;
  decimalPlaces?: number;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'name' | 'maxLength' | 'max' | 'min' | 'minLength'
>;

export default function NumberInput<T extends FieldValues = never>({
  name,
  max,
  min = 0,
  decimalPlaces = 0,
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
    let numVal = v === '' ? NaN : Number(v);

    if (regexSinglePeriod.test(v)) {
      const decimalPart = v.split('.')[1];
      if (!Number.isNaN(numVal) && ((decimalPart?.length > decimalPlaces) || decimalPlaces === 0)) {
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
    const numVal = val === '' ? NaN : Number(val);
    if (!Number.isNaN(numVal)) {
      setValueNumber(name, numVal ? `${numVal}` : '');
    }
    trigger(name);
  };

  return (
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
      {...inputProps}
    />
  );
}
