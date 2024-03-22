import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { useFormContext, useWatch } from 'react-hook-form';
import EveryXDayInput from './EveryXDayInput';
import DaysOfWeekSelector from './DaysOfWeekSelector';
import DaysOfMonthSelector from './DaysOfMonthSelector';
import OddEvenDaySelector from './OddEvenDaySelector';
import OnOffDaysInput from './OnOffDaysInput';
import styles from '@styles/components/medicineForm/medicineIntakeTimesSettings/frequency/frequencyTypeBasedForm/index.module.scss';
import WeekendIntakeTimes from './WeekendIntakeTimes';

export function FrequencyTypeBasedForm() {
  const { control } = useFormContext<MedicineForm>();

  const frequencyType = useWatch({ control, name: 'frequency.type' });

  switch (frequencyType) {
    case 'EVERYDAY':
      return (
        <div className={styles.container}>
          <WeekendIntakeTimes />
        </div>
      );

    case 'EVERY_X_DAY':
      return (
        <div className={styles.container}>
          <EveryXDayInput />
        </div>
      );

    case 'SPECIFIC_DAYS_OF_WEEK':
      return (
        <div className={styles.container}>
          <DaysOfWeekSelector />
        </div>
      );

    case 'SPECIFIC_DAYS_OF_MONTH':
      return (
        <div className={styles.container}>
          <DaysOfMonthSelector />
        </div>
      );

    case 'ODD_EVEN_DAY':
      return (
        <div className={styles.container}>
          <OddEvenDaySelector />
        </div>
      );

    case 'ON_OFF_DAYS':
      return (
        <div className={styles.container}>
          <OnOffDaysInput />
        </div>
      );

    default:
      return null;
  }
}
