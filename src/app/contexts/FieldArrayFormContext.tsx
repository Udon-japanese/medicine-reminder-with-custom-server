import { useContext, createContext } from 'react';
import { FieldValues, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

type AllFormReturn<TFieldValues extends FieldValues = FieldValues> =
  UseFormReturn<TFieldValues> & UseFieldArrayReturn<TFieldValues>;

const FieldArrayFormContext = createContext<AllFormReturn | null>(null);

FieldArrayFormContext.displayName = 'RHFArrayContext';

export const useFieldArrayFormContext = <
  TFieldValues extends FieldValues,
>(): AllFormReturn<TFieldValues> => {
  return useContext(FieldArrayFormContext) as unknown as AllFormReturn<TFieldValues>;
};

export declare type FieldArrayFormProviderProps<
  TFieldValues extends FieldValues = FieldValues,
> = {
  children: React.ReactNode;
} & AllFormReturn<TFieldValues>;

export const FieldArrayFormProvider = <TFieldValues extends FieldValues>({
  children,
  ...props
}: FieldArrayFormProviderProps<TFieldValues>) => {
  return (
    <FieldArrayFormContext.Provider value={{ ...props } as unknown as AllFormReturn}>
      {children}
    </FieldArrayFormContext.Provider>
  );
};
