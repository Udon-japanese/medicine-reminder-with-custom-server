'use client';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import {
  DesktopTimePicker,
  DesktopTimePickerProps,
  LocalizationProvider,
  StaticTimePicker,
  StaticTimePickerProps,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '../../DateTimePicker/TextField';
import { isInvalidDate } from '@/utils/isInvalidDate';
import styles from '@/styles/components/dateTimePicker.module.scss';
import Modal from '../../Modal';
import ActionBar from '../../DateTimePicker/ActionBar';

export default function TimePicker({ index }: { index: number }) {
  const [open, setOpen] = useState(false);
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
              <CustomDesktopTimePicker
                index={index}
                open={open}
                setOpen={setOpen}
                {...fieldProps}
                inputRef={ref}
              />
            ) : (
              <CustomMobileTimePicker
                open={open}
                setOpen={setOpen}
                index={index}
                {...fieldProps}
                label={
                  isInvalidDate(fieldProps.value)
                    ? null
                    : format(fieldProps.value, 'HH:mm')
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

function CustomDesktopTimePicker({
  open,
  setOpen,
  index,
  slots,
  ...other
}: Omit<DesktopTimePickerProps<Date>, 'open' | 'onOpen' | 'onClose'> & {
  index: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    trigger,
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors?.intakeTimes?.[index]?.time?.message;
  return (
    <DesktopTimePicker
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        trigger('intakeTimes');
      }}
      slots={{ textField: TextField, ...slots }}
      slotProps={{
        textField: {
          onClick: () => setOpen(true),
          onBlur: () => trigger('intakeTimes'),
          className: err ? styles.isInvalid : styles.isValid,
        },
      }}
      {...other}
    />
  );
}

function CustomMobileTimePicker(
  props: StaticTimePickerProps<Date> & {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    label: string | null;
    index: number;
  },
) {
  const {
    trigger,
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const err = errors?.intakeTimes?.[props.index]?.time?.message;
  const { open, setOpen, label, ...other } = props;

  return (
    <>
      <Modal
        showModal={open}
        setShowModal={setOpen}
        desktopOnly
        dialogClassName={styles.mobileDateTimePickerDialog}
      >
        <StaticTimePicker
          ref={null}
          localeText={{
            toolbarTitle: '時間を選択',
            cancelButtonLabel: 'キャンセル',
            okButtonLabel: 'OK',
          }}
          slots={{
            actionBar: ActionBar,
            ...props.slots,
          }}
          slotProps={{
            toolbar: { toolbarFormat: 'yyyy年M月d日' },
            actionBar: {
              setOpen,
              onClose: () => {
                trigger('intakeTimes');
              },
            } as any,
          }}
          minutesStep={1}
          {...other}
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
