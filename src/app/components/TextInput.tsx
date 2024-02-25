'use client';
import { ChangeEvent, InputHTMLAttributes } from 'react';
import { FieldValues, PathValue, useFormContext } from 'react-hook-form';
import { FieldByType } from '@/types/FieldByType';

type Props<T extends FieldValues> = {
  name: FieldByType<T, string>;
  max: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'name' | 'maxLength' | 'max' | 'onBlur' | 'onChange'>;

export default function TextInput<T extends FieldValues = never>({
  name,
  max,
  onBlur,
  onChange,
  ...inputProps
}: Props<T>) {
  const { register, setValue, trigger } = useFormContext<T>();

  const setValueString = (name: FieldByType<T, string>, value: string) => {
    setValue(name, value as PathValue<T, FieldByType<T, string>>);
  };

  const handleChange = (val: string) => {
    if (val.length > max) {
      val = val.slice(0, max);
    }

    setValueString(name, val);
  };
  const handleBlur = () => {
    trigger(name);
  };

  return (
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
      type='text'
      {...inputProps}
    />
  );
}
