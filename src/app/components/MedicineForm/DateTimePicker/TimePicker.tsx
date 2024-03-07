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
import TextField from '../../DateTImePickerFIeld/TextField';
import ButtonField from '../../DateTImePickerFIeld/ButtonField';
import { isInvalidDate } from '@/utils/isInvalidDate';
import styles from '@/styles/components/dateTimePickerField.module.scss';

export default function TimePicker({ index }: { index: number }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const { isMd } = useMediaQuery();
  const err = errors?.intakeTimes?.[index]?.time?.message;

  return (
    <>
      <Controller
        name={`intakeTimes.${index}.time` as const}
        control={control}
        render={({ field: { ref, ...fieldProps } }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            {isMd ? (
              <CustomDesktopTimePicker index={index} {...fieldProps} inputRef={ref} />
            ) : (
              <CustomMobileTimePicker
                index={index}
                {...fieldProps}
                label={
                  isInvalidDate(fieldProps.value)
                    ? null
                    : format(fieldProps.value, 'HH:mm')
                }
                inputRef={ref}
              />
            )}
          </LocalizationProvider>
        )}
      />
      {err && <div className={styles.errMessage}>{err}</div>}
    </>
  );
}

function CustomDesktopTimePicker(
  props: DesktopTimePickerProps<Date> & { index: number },
) {
  const [open, setOpen] = useState(false);
  const {
    trigger,
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors?.intakeTimes?.[props.index]?.time?.message;

  return (
    <DesktopTimePicker
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        trigger('intakeTimes');
      }}
      slots={{ textField: TextField, ...props.slots }}
      slotProps={{
        textField: {
          onClick: () => setOpen(true),
          onBlur: () => trigger('intakeTimes'),
          className: err ? styles.isInvalid : styles.isValid,
        },
      }}
      {...props}
    />
  );
}

function CustomMobileTimePicker(
  props: Omit<MobileTimePickerProps<Date>, 'open' | 'onOpen' | 'onCLose'> & {
    index: number;
  },
) {
  const [open, setOpen] = useState(false);
  const {
    trigger,
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors?.intakeTimes?.[props.index]?.time?.message;

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
        field: { setOpen, className: err ? styles.isInvalid : '' } as any,
      }}
      {...props}
      open={open}
      onClose={() => {
        setOpen(false);
        trigger('intakeTimes');
      }}
      onOpen={() => setOpen(true)}
    />
  );
}
