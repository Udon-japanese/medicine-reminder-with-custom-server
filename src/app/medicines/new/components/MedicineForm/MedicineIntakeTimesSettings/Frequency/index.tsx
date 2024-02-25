import { Popover } from '@/app/components/Popover';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { translateFrequencyToJapanese } from '@/utils/translateToJapanese';
import { FrequencyType } from '@prisma/client';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import FrequencyTypeSelector from './FrequencyTypeSelector';
import { FrequencyTypeBasedForm } from './FrequencyTypeBasedForm';

export default function Frequency() {
  const { control, getValues } = useFormContext<MedicineForm>();
  const frequencyType = useWatch({ control, name: 'frequency.type' });
  const [openPopover, setOpenPopover] = useState(false);

  const getFrequencyOptions = (freqType: FrequencyType) => {
    switch (freqType) {
      case 'EVERYDAY':
        return {};
      case 'EVERY_X_DAY':
        return { everyXDay: getValues('frequency.everyXDay') };
      case 'SPECIFIC_DAYS_OF_WEEK':
        return { specificDaysOfWeek: getValues('frequency.specificDaysOfWeek') };
      case 'SPECIFIC_DAYS_OF_MONTH':
        return { specificDaysOfMonth: getValues('frequency.specificDaysOfMonth') };
      case 'ODD_EVEN_DAY':
        return { isOddDay: getValues('frequency.isOddDay') };
      case 'ON_OFF_DAYS':
        return {
          onDays: getValues('frequency.onDays'),
          offDays: getValues('frequency.offDays'),
        };
      default:
        return {};
    }
  };

  return (
    <div>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        content={
          <div>
            <div>頻度</div>
            <FrequencyTypeSelector />
            <FrequencyTypeBasedForm />
          </div>
        }
      >
        <button type='button'>
          頻度:
          {translateFrequencyToJapanese(
            frequencyType,
            getFrequencyOptions(frequencyType),
          )}
        </button>
      </Popover>
    </div>
  );
}
