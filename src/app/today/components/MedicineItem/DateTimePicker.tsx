'use client';
import {
  LocalizationProvider,
  DesktopDateTimePickerProps,
  DesktopDateTimePicker,
  MobileDateTimePickerProps,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { Dispatch, SetStateAction } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';
import { format } from 'date-fns';
import ButtonField from '@/app/components/DateTImePickerFIeld/ButtonField';
import TextField from '@/app/components/DateTImePickerFIeld/TextField';
import { isInvalidDate } from '@/utils/isInvalidDate';
import styles from '@styles/components/dateTimePickerField.module.scss';
import { MedicineRecordForm } from '@/types/zodSchemas/medicineRecord/schema';

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

export default function DateTimePicker({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<MedicineRecordForm>();
  const { isMd } = useMediaQuery();
  const err = errors?.intakeDate?.message;

  return (
    <>
      <Controller
        name='intakeDate'
        control={control}
        render={({ field: { ref, ...fieldProps } }) => (
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ja}
            dateFormats={{ year: 'yyyy年', monthAndYear: 'yyyy年M月' }}
          >
            {isMd ? (
              <CustomDesktopDatePicker
                open={open}
                setOpen={setOpen}
                {...fieldProps}
                inputRef={ref}
              />
            ) : (
              <CustomMobileDatePicker
                open={open}
                setOpen={setOpen}
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
      {err && <div className={styles.errMessage}>{err}</div>}
    </>
  );
}

function CustomDesktopDatePicker(
  props: DesktopDateTimePickerProps<Date> & {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  },
) {
  const {
    trigger,
    formState: { errors },
  } = useFormContext<MedicineRecordForm>();
  const err = errors?.intakeDate?.message;
  const { open, setOpen, ...other } = props;

  return (
    <DesktopDateTimePicker
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
          onBlur: () => trigger('intakeDate'),
          className: err ? styles.isInvalid : styles.isValid,
        },
        toolbar: { toolbarFormat: 'M月d日', hidden: false },
      }}
      orientation='landscape'
      {...other}
      {...timePickerProps()}
    />
  );
}

function CustomMobileDatePicker(
  props: Omit<MobileDateTimePickerProps<Date>, 'open' | 'onOpen' | 'onCLose'> & {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  },
) {
  const {
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors?.period?.startDate?.message;
  const { open, setOpen, ...other } = props;

  return (
    <MobileDateTimePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{
        field: { setOpen, className: err ? styles.isInvalid : '' } as any,
        toolbar: { toolbarFormat: 'M月d日' },
        dialog: { disablePortal: true },
      }}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      {...other}
      {...timePickerProps()}
    />
  );
}
