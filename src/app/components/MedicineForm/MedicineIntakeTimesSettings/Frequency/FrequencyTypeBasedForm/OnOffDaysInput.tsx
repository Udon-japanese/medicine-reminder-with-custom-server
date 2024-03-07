import NumberInput from '@/app/components/NumberInput';
import useErrorMessage from '@/app/hooks/useErrorMessage';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import styles from '@styles/components/medicineForm/medicineIntakeTimesSettings/frequency/frequencyTypeBasedForm/onOffDaysInput.module.scss';

export default function OnOffDaysInput() {
  const [onDaysErr, offDaysErr] = useErrorMessage<MedicineForm>(
    'frequency.onDays',
    'frequency.offDays',
  );

  return (
    <>
      <div className={styles.onDaysInputContainer}>
        <NumberInput<MedicineForm>
          name='frequency.onDays'
          label='服用(何日間)'
          max={200}
          min={1}
          placeholder='1~200'
          error={onDaysErr}
        />
      </div>
      <NumberInput<MedicineForm>
        name='frequency.offDays'
        label='休薬(何日間)'
        max={200}
        min={1}
        placeholder='1~200'
        error={offDaysErr}
      />
    </>
  );
}
