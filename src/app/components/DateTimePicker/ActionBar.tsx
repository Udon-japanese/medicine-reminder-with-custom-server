import { PickersActionBarProps } from '@mui/x-date-pickers';
import { Button } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import styles from '@styles/components/dateTimePicker.module.scss';

export default function ActionBar({
  onCancel,
  onAccept,
  className,
  setOpen,
  onClose,
}: PickersActionBarProps & {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
}) {
  const closePicker = () => {
    setOpen?.(false);
    onClose?.();
  };
  const actions = [
    {
      text: 'キャンセル',
      onClick: () => {
        onCancel();
        closePicker();
      },
    },
    {
      text: 'OK',
      onClick: () => {
        onAccept();
        closePicker();
      },
    },
  ];

  return (
    <div className={`${className} ${styles.actionBar}`}>
      {actions.map(({ onClick, text }, index) => (
        <Button key={index} onClick={onClick} variant='text'>
          {text}
        </Button>
      ))}
    </div>
  );
}
