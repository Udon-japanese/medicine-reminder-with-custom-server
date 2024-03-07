import ErrorMessage from '@/app/components/ErrorMessage';
import NumberInput from '@/app/components/NumberInput';
import { Popover } from '@/app/components/Popover';
import SwitchButton from '@/app/components/SwitchButton';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styles from '@styles/components/medicineForm/medicineStock.module.scss';
import inputWithLabelStyles from '@styles/components/medicineForm/input-with-label.module.scss';
import useErrorMessage from '@/app/hooks/useErrorMessage';

export default function MedicineStock() {
  const { control, setValue, trigger, getValues } = useFormContext<MedicineForm>();
  const [openPopover, setOpenPopover] = useState(false);
  const stock = useWatch({ control, name: 'stock' });
  const unit = useWatch({ control, name: 'unit' });
  const quantityErr = useErrorMessage<MedicineForm>('stock.quantity');
  const autoConsumeErr = useErrorMessage<MedicineForm>('stock.autoConsume');

  const getStockText = () => {
    if (stock.manageStock) {
      if (stock?.quantity && Number.isInteger(Number(stock?.quantity))) {
        return `${stock?.quantity}${unit ? ` ${unit}` : ''}`;
      } else {
        return '無効な値が入力されています';
      }
    }
    return '在庫を設定しない';
  };

  return (
    <>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        drawerClassName={styles.drawer}
        content={
          <div className={styles.container}>
            <div className={styles.drawerHeader}>在庫</div>
            <label htmlFor='manageStock' className={styles.labelContainer}>
              <div>在庫を管理する</div>
              <SwitchButton<MedicineForm>
                name='stock.manageStock'
                id='manageStock'
                onCheckedChange={() => {
                  if (!getValues('stock.quantity') && !getValues('stock.autoConsume')) {
                    setValue('stock.quantity', `${0}`);
                    setValue('stock.autoConsume', false);
                    trigger('stock');
                  }
                }}
              />
            </label>
            {stock?.manageStock && (
              <>
                <div className={styles.quantityContainer}>
                  <label htmlFor="stock.quantity" className={styles.quantityLabel}>在庫数</label>
                  <label
                    className={`${inputWithLabelStyles.inputContainer} ${quantityErr ? inputWithLabelStyles.isInvalid : inputWithLabelStyles.isValid}`}
                  >
                    <NumberInput<MedicineForm>
                      name='stock.quantity'
                      max={1000}
                      error={quantityErr}
                      className={unit ? inputWithLabelStyles.input : ''}
                      disableStyles
                      displayErrMessage={false}
                    />
                    {unit && <div className={inputWithLabelStyles.label}>{unit}</div>}
                  </label>
                  {quantityErr && (
                    <div className={inputWithLabelStyles.errContainer}>
                      <div className={styles.errMessage}>{quantityErr}</div>
                    </div>
                  )}
                </div>
                <div>
                  <label className={styles.autoConsumeContainer} htmlFor='autoConsumeStock'>
                    <div className={styles.labelAndButtonContainer}>
                    <div>自動消費</div>
                    <SwitchButton<MedicineForm>
                      name='stock.autoConsume'
                      id='autoConsumeStock'
                    />
                    </div>
                    <div className={styles.info}>アラーム時間になると自動的に在庫が消費されます</div>
                  </label>
                  {autoConsumeErr && (
                    <div className={styles.errMessage}>{autoConsumeErr}</div>
                  )}
                </div>
              </>
            )}
          </div>
        }
      >
        <button className={styles.labelContainer} type='button'>
          <div>在庫</div>
          <div>{getStockText()}</div>
        </button>
      </Popover>
    </>
  );
}
