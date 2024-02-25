import { Popover } from '@/app/components/Popover';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import DatePicker from '../../MedicineForm/DateTimePicker/DatePIcker';
import SwitchButton from '@/app/components/SwitchButton';
import NumberInput from '@/app/components/NumberInput';
import ErrorMessage from '@/app/components/ErrorMessage';
import { formatPeriod } from '@/utils/formatPeriod';

export default function Period() {
  const { control, setValue, trigger, getValues } = useFormContext<MedicineForm>();
  const period = useWatch({ control, name: 'period' });
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        isDrawerFullHeight
        content={
          <div>
            <div>期間</div>
            <div>
              <DatePicker />
            </div>
            <div>
              <label className='Label' htmlFor='hasDeadline'>
                期限を設ける
              </label>
              <SwitchButton<MedicineForm>
                name='period.hasDeadline'
                id='hasDeadline'
                onCheckedChange={() => {
                  if (!getValues('period.days')) {
                    setValue('period.days', `${30}`);
                    trigger('period.days');
                  }
                }}
              />
            </div>
            {period?.hasDeadline && (
              <div>
                <NumberInput<MedicineForm> name='period.days' max={1000} min={1} />
                <ErrorMessage<MedicineForm> name='period.days' />
              </div>
            )}
          </div>
        }
      >
        <button type='button'>
          期間:
          {formatPeriod(
            period?.startDate,
            period?.hasDeadline,
            period?.hasDeadline ? period?.days : undefined,
          )}
        </button>
      </Popover>
    </div>
  );
}
