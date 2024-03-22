'use client';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import {
  DesktopTimePicker as MUIDesktopTimePicker,
  DesktopTimePickerProps as MUIDesktopTimePickerProps,
  LocalizationProvider,
  StaticTimePicker,
  StaticTimePickerProps,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import TextField from '../../DateTimePicker/TextField';
import { isInvalidDate } from '@/utils/isInvalidDate';
import styles from '@/styles/components/dateTimePicker.module.scss';
import Modal from '../../Modal';
import ActionBar from '../../DateTimePicker/ActionBar';

type TimePickerProps<T> = { name: Path<T>; triggerName: Path<T>, error: string | undefined };
export default function TimePicker<T extends FieldValues>({
  name,
  triggerName,
  error,
}: TimePickerProps<T>) {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext<T>();
  const { isMd } = useMediaQuery();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { ref, ...fieldProps } }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            {isMd ? (
              <DesktopTimePicker<T>
                open={open}
                setOpen={setOpen}
                triggerName={triggerName}
                error={error}
                {...fieldProps}
                inputRef={ref}
              />
            ) : (
              <MobileTimePicker<T>
                open={open}
                setOpen={setOpen}
                triggerName={triggerName}
                error={error}
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
      {error && <div className={styles.errMessage}>{error}</div>}
    </>
  );
}

interface DesktopTimePickerProps<T>
  extends Omit<MUIDesktopTimePickerProps<Date>, 'open' | 'onOpen' | 'onClose' | 'name'> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  triggerName: Path<T>;
  error: string | undefined;
}
function DesktopTimePicker<T extends FieldValues>({
  open,
  setOpen,
  slots,
  triggerName,
  error,
  ...other
}: DesktopTimePickerProps<T>) {
  const { trigger } = useFormContext<T>();

  return (
    <MUIDesktopTimePicker
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        trigger(triggerName);
      }}
      slots={{ textField: TextField, ...slots }}
      slotProps={{
        textField: {
          onClick: () => setOpen(true),
          onBlur: () => trigger(triggerName),
          className: error ? styles.isInvalid : styles.isValid,
        },
      }}
      {...other}
    />
  );
}

interface MobileTimePickerProps<T> extends Omit<StaticTimePickerProps<Date>, 'name'> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  label: string | null;
  triggerName: Path<T>;
  error: string | undefined;
}
function MobileTimePicker<T extends FieldValues>({
  open,
  setOpen,
  label,
  triggerName,
  slots,
  error,
  ...other
}: MobileTimePickerProps<T>) {
  const { trigger } = useFormContext<T>();

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
            ...slots,
          }}
          slotProps={{
            toolbar: { toolbarFormat: 'yyyy年M月d日' },
            actionBar: {
              setOpen,
              onClose: () => {
                trigger(triggerName);
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
          }}
          minutesStep={1}
          {...other}
        />
      </Modal>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className={`${error ? styles.isInvalid : ''} ${styles.field}`}
      >
        {label}
      </button>
    </>
  );
}
