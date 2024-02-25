import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { Done } from '@mui/icons-material';
import { MedicineUnit } from '@prisma/client';
import { forwardRef } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

interface Props extends ControllerRenderProps<MedicineForm> {
  medUnit: MedicineUnit;
}

const SelectMedicineUnitButton = forwardRef<HTMLDivElement, Props>(
  ({ medUnit, ...fieldProps }, ref) => {
    const { onChange, disabled } = fieldProps;

    return (
      <div ref={ref}>
        <button
          type='button'
          disabled={disabled}
          onClick={() => {
            onChange(medUnit.unit);
          }}
        >
          {medUnit.unit}
          {fieldProps.value === medUnit.unit && <Done />}
        </button>
      </div>
    );
  },
);

export default SelectMedicineUnitButton;
