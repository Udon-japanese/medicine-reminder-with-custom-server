import { FieldByType } from '@/types/FieldByType';
import { Done } from '@mui/icons-material';
import { ButtonHTMLAttributes } from 'react';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import styles from '@styles/components/checkButton.module.scss';

type Props<T extends FieldValues> = {
  name: FieldByType<T, boolean>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function CheckButton<T extends FieldValues>(props: Props<T>) {
  const { control, trigger } = useFormContext<T>();
  const { name, ...buttonProps } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <button
          type='button'
          className={`${styles.button} ${value ? styles.checked : ''}`}
          onClick={() => {
            onChange(!value);
            trigger(name);
          }}
          {...buttonProps}
        >
          <Done />
        </button>
      )}
    />
  );
}
