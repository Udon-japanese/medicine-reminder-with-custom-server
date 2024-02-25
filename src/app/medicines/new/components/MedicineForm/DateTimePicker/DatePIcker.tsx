'use client';
import {
  LocalizationProvider,
  DesktopDatePicker,
  MobileDatePicker,
  DesktopDatePickerProps,
  MobileDatePickerProps,
} from '@mui/x-date-pickers';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';
import { format } from 'date-fns';
import ButtonField from './ButtonField';
import TextField from './TextField';
import { isInvalidDate } from '@/utils/isInvalidDate';

const timePickerProps = () => {
  return {
    localeText: {
      toolbarTitle: '日付を選択',
      nextMonth: '次月',
      previousMonth: '前月',
      cancelButtonLabel: 'キャンセル',
      okButtonLabel: 'OK',
    },
    format: 'yyyy年M月d日',
    ref: null,
  };
};

export default function DatePicker() {
  const { control } = useFormContext<MedicineForm>();
  const { isMd } = useMediaQuery();

  return (
    <Controller
      name='period.startDate'
      control={control}
      render={({ field: { ref, ...fieldProps } }) => (
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={ja}
          dateFormats={{ year: 'yyyy年', monthAndYear: 'yyyy年M月' }}
        >
          {isMd ? (
            <CustomDesktopDatePicker {...fieldProps} inputRef={ref} />
          ) : (
            <CustomMobileDatePicker
              {...fieldProps}
              label={
                fieldProps.value === null || isInvalidDate(fieldProps.value)
                  ? null
                  : format(fieldProps.value, 'yyyy年M月d日')
              }
              inputRef={ref}
            />
          )}
        </LocalizationProvider>
      )}
    />
  );
}

function CustomDesktopDatePicker(props: DesktopDatePickerProps<Date>) {
  const [open, setOpen] = useState(false);
  const { trigger } = useFormContext<MedicineForm>();
  return (
    <DesktopDatePicker
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      slots={{
        textField: TextField,
        ...props.slots,
      }}
      slotProps={{
        textField: {
          onClick: () => setOpen(true),
          onBlur: () => trigger('period.startDate'),
        },
        toolbar: { toolbarFormat: 'yyyy年M月d日', hidden: false },
      }}
      {...props}
      {...timePickerProps()}
    />
  );
}

function CustomMobileDatePicker(
  props: Omit<MobileDatePickerProps<Date>, 'open' | 'onOpen' | 'onCLose'>,
) {
  const [open, setOpen] = useState(false);

  return (
    <MobileDatePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{
        field: { setOpen } as any,
        toolbar: { toolbarFormat: 'yyyy年M月d日' },
        dialog: { disablePortal: true },
      }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      {...timePickerProps()}
    />
  );
}
