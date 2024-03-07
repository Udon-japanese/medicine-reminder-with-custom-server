import { Popover } from '@/app/components/Popover';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { getFrequencyText } from '@/utils/getMedicineText';
import { FrequencyType } from '@prisma/client';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import FrequencyTypeSelector from './FrequencyTypeSelector';
import { FrequencyTypeBasedForm } from './FrequencyTypeBasedForm';
import styles from '@/styles/components/medicineForm/medicineIntakeTimesSettings/frequency/index.module.scss';

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
    <>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        align='end'
        drawerClassName={styles.drawer}
        content={
          <div className={styles.popoverContainer}>
            <div className={styles.drawerHeader}>頻度</div>
            <div className={styles.frequencyContainer}>
              <FrequencyTypeSelector />
              <FrequencyTypeBasedForm />
            </div>
          </div>
        }
      >
        <button type='button' className={styles.labelContainer}>
          <div className={styles.label}>頻度</div>
          <div className={styles.value}>
            {getFrequencyText(frequencyType, getFrequencyOptions(frequencyType))}
          </div>
        </button>
      </Popover>
    </>
  );
}
