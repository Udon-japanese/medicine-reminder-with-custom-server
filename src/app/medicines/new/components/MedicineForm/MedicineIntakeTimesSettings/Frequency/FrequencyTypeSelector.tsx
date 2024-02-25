import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { translateFrequencyToJapanese } from '@/utils/translateToJapanese';
import { Done } from '@mui/icons-material';
import { FrequencyType } from '@prisma/client';
import { Controller, useFormContext } from 'react-hook-form';

export default function FrequencyTypeSelector() {
  const frequencyTypes = Object.values(FrequencyType);
  const { control } = useFormContext<MedicineForm>();

  return (
    <Controller
      control={control}
      name='frequency.type'
      render={({ field: { value, onChange, ...props } }) => (
        <>
          {frequencyTypes.map((freqType, index) => (
            <div key={index}>
              <button type='button' onClick={() => onChange(freqType)} {...props}>
                {translateFrequencyToJapanese(freqType)}
                {freqType === value && <Done />}
              </button>
            </div>
          ))}
        </>
      )}
    />
  );
}
