'use client';
import {
  LocalizationProvider,
  DesktopDateTimePickerProps as MUIDesktopDateTimePickerProps,
  DesktopDateTimePicker as MUIDesktopDateTimePicker,
  StaticDateTimePicker,
  StaticDateTimePickerProps,
} from '@mui/x-date-pickers';
import { Dispatch, SetStateAction } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';
import { format, getYear, isToday } from 'date-fns';
import TextField from '@/app/components/DateTimePicker/TextField';
import { isInvalidDate } from '@/utils/isInvalidDate';
import styles from '@styles/components/dateTimePicker.module.scss';
import { MedicineRecordForm } from '@/types/zodSchemas/medicineRecordForm/schema';
import Modal from '@/app/components/Modal';
import ActionBar from '@/app/components/DateTimePicker/ActionBar';

const dateTimePickerProps = () => {
  return {
    localeText: {
      toolbarTitle: '日付を選択',
      nextMonth: '次月',
      previousMonth: '前月',
      cancelButtonLabel: 'キャンセル',
      okButtonLabel: 'OK',
    },
    format: 'yyyy年M月d日 H:m',
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

  const getLabel = (date: Date | null) => {
    if (date === null || isInvalidDate(date)) return null;
    const isThisYear = getYear(new Date()) === getYear(date);
    const dayFormatString = isToday(date)
      ? '今日'
      : isThisYear
        ? 'M月d日'
        : 'yyyy年M月d日';

    return format(date, `${dayFormatString} H:mm`);
  };

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
              <DesktopDateTimePicker
                open={open}
                setOpen={setOpen}
                {...fieldProps}
                inputRef={ref}
              />
            ) : (
              <MobileDateTimePicker
                open={open}
                setOpen={setOpen}
                {...fieldProps}
                label={getLabel(fieldProps.value)}
              />
            )}
          </LocalizationProvider>
        )}
      />
      {err && <div className={styles.errMessage}>{err}</div>}
    </>
  );
}

function DesktopDateTimePicker(
  props: MUIDesktopDateTimePickerProps<Date> & {
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
    <MUIDesktopDateTimePicker
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
      {...dateTimePickerProps()}
    />
  );
}

function MobileDateTimePicker(
  props: StaticDateTimePickerProps<Date> & {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    label: string | null;
  },
) {
  const {
    formState: { errors },
  } = useFormContext<MedicineRecordForm>();
  const err = errors?.intakeDate?.message;
  const { open, setOpen, label, ...other } = props;

  return (
    <>
      <Modal
        showModal={open}
        setShowModal={setOpen}
        desktopOnly
        dialogClassName={styles.mobileDateTimePickerDialog}
      >
        <StaticDateTimePicker
          slots={{
            actionBar: ActionBar,
            ...props.slots,
          }}
          slotProps={{
            toolbar: { toolbarFormat: 'M月d日' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            actionBar: { setOpen } as any,
          }}
          {...other}
          {...dateTimePickerProps()}
        />
      </Modal>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className={`${err ? styles.isInvalid : ''} ${styles.field}`}
      >
        {label}
      </button>
    </>
  );
}
