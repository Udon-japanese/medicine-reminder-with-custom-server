'use client';
import {
  LocalizationProvider,
  DesktopDatePicker,
  DesktopDatePickerProps,
  StaticDatePickerProps,
  StaticDatePicker,
} from '@mui/x-date-pickers';
import { Dispatch, SetStateAction } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';
import { format } from 'date-fns';
import ButtonField from '../../DateTimePicker/ButtonField';
import TextField from '../../DateTimePicker/TextField';
import { isInvalidDate } from '@/utils/isInvalidDate';
import styles from '@styles/components/dateTimePicker.module.scss';
import Modal from '../../Modal';
import ActionBar from '../../DateTimePicker/ActionBar';

const datePickerProps = () => {
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

export default function DatePicker({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const { isMd } = useMediaQuery();
  const err = errors?.period?.startDate?.message;

  return (
    <>
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
  props: DesktopDatePickerProps<Date> & {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  },
) {
  const {
    trigger,
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors?.period?.startDate?.message;
  const { open, setOpen, ...other } = props;

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
          className: err ? styles.isInvalid : styles.isValid,
        },
        toolbar: { toolbarFormat: 'yyyy年M月d日', hidden: false },
      }}
      orientation='landscape'
      {...other}
      {...datePickerProps()}
    />
  );
}

function CustomMobileDatePicker(
  props: StaticDatePickerProps<Date> & {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    label: string | null;
  },
) {
  const {
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors?.period?.startDate?.message;
  const { open, setOpen, label, ...other } = props;

  return (
    <>
      <Modal
        showModal={open}
        setShowModal={setOpen}
        desktopOnly
        dialogClassName={styles.mobileDateTimePickerDialog}
      >
        <StaticDatePicker
          slots={{
            actionBar: ActionBar,
            ...props.slots,
          }}
          slotProps={{
            toolbar: { toolbarFormat: 'yyyy年M月d日' },
            actionBar: { setOpen } as any,
          }}
          {...other}
          {...datePickerProps()}
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
