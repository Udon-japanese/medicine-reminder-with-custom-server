import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { getFrequencyText } from '@/utils/getMedicineText';
import { Done } from '@mui/icons-material';
import { FrequencyType } from '@prisma/client';
import { Controller, useFormContext } from 'react-hook-form';
import styles from '@styles/components/medicineForm/medicineIntakeTimesSettings/frequency/frequencyTypeSelector.module.scss';

export default function FrequencyTypeSelector() {
  const frequencyTypes = Object.values(FrequencyType);
  const { control, getValues, setValue } = useFormContext<MedicineForm>();

  return (
    <Controller
      control={control}
      name='frequency.type'
      render={({ field: { value, onChange, ...props } }) => (
        <div className={styles.container}>
          {frequencyTypes.map((freqType, index) => {
            const isCurrentFreqType = freqType === value;

            return (
              <button
                key={index}
                type='button'
                disabled={isCurrentFreqType}
                className={styles.popoverItem}
                onClick={() => {
                  onChange(freqType);
                  
                  if (freqType === 'EVERYDAY') {
                    if (getValues('frequency.everyday.weekendIntakeTimes').length === 0) {
                      setValue(
                        'frequency.everyday.weekendIntakeTimes',
                        getValues('intakeTimes'),
                      );
                    }
                  }
                }}
                {...props}
              >
                {getFrequencyText(freqType)}
                {isCurrentFreqType && <Done />}
              </button>
            );
          })}
        </div>
      )}
    />
  );
}
