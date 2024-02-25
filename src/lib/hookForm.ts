import { KeyboardEvent } from 'react';
import { UseFormProps, UseFormReturn, useForm } from 'react-hook-form';

export const useDefaultForm = <FORM_TYPE extends Record<string, unknown>>(
  options: UseFormProps<FORM_TYPE> & {
    defaultValues: FORM_TYPE;
  },
): UseFormReturn<FORM_TYPE> => {
  return useForm<FORM_TYPE>({
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