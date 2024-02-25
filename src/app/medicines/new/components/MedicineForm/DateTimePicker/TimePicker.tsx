'use client';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import {
  DesktopTimePicker,
  DesktopTimePickerProps,
  LocalizationProvider,
  MobileTimePicker,
  MobileTimePickerProps,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from './TextField';
import ButtonField from './ButtonField';

export default function TimePicker({ index }: { index: number }) {
  const { control } = useFormContext<MedicineForm>();
  const { isMd } = useMediaQuery();

  return (
    <Controller
      name={`intakeTimes.${index}.time` as const}
      control={control}
      render={({ field: { ref, ...fieldProps } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          {isMd ? (
            <CustomDesktopTimePicker {...fieldProps} inputRef={ref} />
          ) : (
            <CustomMobileTimePicker
              {...fieldProps}
              label={fieldProps.value === null ? null : format(fieldProps.value, 'HH:mm')}
              inputRef={ref}
            />
          )}
        </LocalizationProvider>
      )}
    />
  );
}

function CustomDesktopTimePicker(props: DesktopTimePickerProps<Date>) {
  const [open, setOpen] = useState(false);
  const { trigger } = useFormContext<MedicineForm>();

  return (
    <DesktopTimePicker
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      slots={{ textField: TextField, ...props.slots }}
      slotProps={{
        textField: {
          onClick: () => setOpen(true),
          onBlur: () => trigger('intakeTimes'),
        },
      }}
      {...props}
    />
  );
}

function CustomMobileTimePicker(
  props: Omit<MobileTimePickerProps<Date>, 'open' | 'onOpen' | 'onCLose'>,
) {
  const [open, setOpen] = useState(false);

  return (
    <MobileTimePicker
      ref={null}
      localeText={{
        toolbarTitle: '時間を選択',
        cancelButtonLabel: 'キャンセル',
        okButtonLabel: 'OK',
      }}
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{
        field: { setOpen } as any,
      }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}
