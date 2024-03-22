import { FieldByType } from '@/types/FieldByType';
import { Done } from '@mui/icons-material';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import styles from '@styles/components/checkButton.module.scss';

type Props<T extends FieldValues> = {
  name: FieldByType<T, boolean>;
  className?: string;
  onCheckChange?: () => void;
};

export default function CheckButton<T extends FieldValues>({
  name,
  className = '',
  onCheckChange,
}: Props<T>) {
  const { control, trigger } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <label
          role='button'
          className={`${styles.button} ${!value ? styles.unchecked : ''} ${className}`}
        >
          <Done />
          <input
            type='checkbox'
            onChange={() => {
              onChange(!value);
              trigger(name);
              onCheckChange?.();
            }}
          />
        </label>
      )}
    />
  );
}
