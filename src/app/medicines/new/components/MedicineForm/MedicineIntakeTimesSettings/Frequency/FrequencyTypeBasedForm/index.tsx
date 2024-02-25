import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { useFormContext, useWatch } from 'react-hook-form';
import EveryXDayInput from './EveryXDayInput';
import DaysOfWeekSelector from './DaysOfWeekSelector';
import DaysOfMonthSelector from './DaysOfMonthSelector';
import OddEvenDaySelector from './OddEvenDaySelector';
import OnOffDaysInput from './OnOffDaysInput';

export function FrequencyTypeBasedForm() {
  const { control } = useFormContext<MedicineForm>();

  const frequencyType = useWatch({ control, name: 'frequency.type' });

  switch (frequencyType) {
    case 'EVERYDAY':
      return null;

    case 'EVERY_X_DAY':
      return <EveryXDayInput />;

    case 'SPECIFIC_DAYS_OF_WEEK':
      return <DaysOfWeekSelector />;

    case 'SPECIFIC_DAYS_OF_MONTH':
      return <DaysOfMonthSelector />;

    case 'ODD_EVEN_DAY':
      return <OddEvenDaySelector />;

    case 'ON_OFF_DAYS':
      return <OnOffDaysInput />;

    default:
      return null;
  }
}
