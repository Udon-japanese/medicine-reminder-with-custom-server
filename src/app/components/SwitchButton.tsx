import * as Switch from "@radix-ui/react-switch";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import styles from "@styles/components/toggleButton.module.scss";
import { FieldByType } from "@/types/FieldByType";

type Props<T extends FieldValues> = {
  name: FieldByType<T, boolean>;
} & Switch.SwitchProps;

export default function SwitchButton<T extends FieldValues = never>(props: Props<T>) {
  const { control, trigger } = useFormContext<T>();
  const {name, onCheckedChange, ...buttonProps} = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Switch.Root
          checked={value}
          onCheckedChange={(newValue) => {
            onChange(newValue);
            trigger(name);
            onCheckedChange?.(newValue);
          }}
          className={styles.root}
          {...buttonProps}
        >
          <Switch.Thumb className={styles.thumb} />
        </Switch.Root>
      )}
    />
  );
}
