import ErrorMessage from '@/app/components/ErrorMessage';
import NumberInput from '@/app/components/NumberInput';
import { Popover } from '@/app/components/Popover';
import SwitchButton from '@/app/components/SwitchButton';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export default function MedicineStock() {
  const { control, setValue, trigger, getValues } = useFormContext<MedicineForm>();
  const [openPopover, setOpenPopover] = useState(false);
  const stock = useWatch({ control, name: 'stock' });

  return (
    <div>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        content={
          <div>
            <div>在庫</div>
            <label htmlFor='manageStock'>在庫を管理する</label>
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
            {stock?.manageStock && (
              <>
                <div>
                  <NumberInput<MedicineForm> name='stock.quantity' max={1000} />
                  <ErrorMessage<MedicineForm> name='stock.quantity' />
                </div>
                <div>
                  <label htmlFor='autoConsumeStock'>自動消費</label>
                  <SwitchButton<MedicineForm>
                    name='stock.autoConsume'
                    id='autoConsumeStock'
                  />
                  <ErrorMessage<MedicineForm> name='stock.autoConsume' />
                </div>
              </>
            )}
          </div>
        }
      >
        <button type='button'>
          在庫：{stock?.manageStock ? `${stock?.quantity}` : '在庫を設定しない'}
        </button>
      </Popover>
    </div>
  );
}
