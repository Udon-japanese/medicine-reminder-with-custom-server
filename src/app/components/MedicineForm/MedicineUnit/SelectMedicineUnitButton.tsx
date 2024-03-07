import useMediaQuery from '@/app/hooks/useMediaQuery';
import styles from '@/styles/components/medicineForm/medicineUnit/selectMedicineUnitButton.module.scss';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { Done } from '@mui/icons-material';
import { MedicineUnit } from '@prisma/client';
import { Dispatch, SetStateAction, forwardRef } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

interface Props extends ControllerRenderProps<MedicineForm> {
  medUnit: MedicineUnit;
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
}

const SelectMedicineUnitButton = forwardRef<HTMLDivElement, Props>(
  ({ medUnit, setOpenPopover, ...fieldProps }, ref) => {
    const { onChange } = fieldProps;
    const isCurrentUnit = fieldProps.value === medUnit.unit;
    const { isMd } = useMediaQuery();
    return (
      <div ref={ref}>
        <button
          type='button'
          disabled={isCurrentUnit}
          className={`${styles.popoverItem} ${isCurrentUnit && !isMd ? styles.drawerCurrentItem : ''}`}
          onClick={() => {
            onChange(medUnit.unit);
            setOpenPopover(false);
          }}
        >
          {medUnit.unit}
          {isCurrentUnit && isMd && <Done />}
        </button>
      </div>
    );
  },
);

export default SelectMedicineUnitButton;
