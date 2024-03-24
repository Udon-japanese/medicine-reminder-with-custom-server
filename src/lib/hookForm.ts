import { KeyboardEvent } from 'react';
import { UseFormProps, UseFormReturn, useForm } from 'react-hook-form';

export const useDefaultForm = <T extends Record<string, unknown>>(
  options: UseFormProps<T> & {
    defaultValues: T;
  },
): UseFormReturn<T> => {
  return useForm<T>({
    mode: 'onBlur',
    shouldFocusError: false,
    criteriaMode: 'all',
    ...options,
  });
};

export const handleFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
  const { key, target } = e;

  if (key !== 'Enter' || target instanceof HTMLTextAreaElement) {
    return;
  }

  e.preventDefault();
};