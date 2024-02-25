import { useFieldArrayFormContext } from '@/app/contexts/FieldArrayFormContext';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { addHours, startOfHour } from 'date-fns';
import { useFormContext, useWatch } from 'react-hook-form';
import TimePicker from '../MedicineForm/DateTimePicker/TimePicker';
import NumberInput from '@/app/components/NumberInput';
import { Add, Delete } from '@mui/icons-material';
import ErrorMessage from '@/app/components/ErrorMessage';

export default function MedicineIntakeTimes() {
  const { fields, remove, append } = useFieldArrayFormContext<MedicineForm>();
  const { control, trigger, setValue } = useFormContext<MedicineForm>();

  const frequency = useWatch({ control, name: 'frequency' });
  const period = useWatch({ control, name: 'period' });
  const notify = useWatch({ control, name: 'notify' });
  const lastIntakeTime = useWatch({
    control,
    name: `intakeTimes.${fields.length - 1}.time` as const,
  });
  const lastDosage = useWatch({
    control,
    name: `intakeTimes.${fields.length - 1}.dosage` as const,
  });

  const newIntakeTime =
    fields.length && lastIntakeTime
      ? addHours(lastIntakeTime, 4)
      : addHours(startOfHour(new Date()), 1);
  const newDosage = fields.length && lastDosage ? lastDosage : 1;

  const handleClickAddIntakeTime = () => {
    if (!fields.length && frequency === null && period === null && notify === null) {
      setValue('frequency.type', 'EVERYDAY');
      setValue('frequency.everyXDay', `${2}`);
      setValue('frequency.isOddDay', true);
      setValue('frequency.onDays', `${21}`);
      setValue('frequency.offDays', `${7}`);
      setValue('period', { startDate: new Date(), hasDeadline: false });
      setValue('notify', true);
      trigger(['frequency', 'period', 'notify']);
    }
    append({ time: newIntakeTime, dosage: newDosage.toString() });
  };

  return (
    <>
      {fields.map((item, index) => {
        return (
          <div key={item.id}>
            <TimePicker index={index} />
            <ErrorMessage<MedicineForm> name={`intakeTimes.${index}.time` as const} />
            <NumberInput<MedicineForm>
              name={`intakeTimes.${index}.dosage` as const}
              max={1000}
              decimalPlaces={2}
            />
            <ErrorMessage<MedicineForm> name={`intakeTimes.${index}.dosage` as const} />
            <button type='button' onClick={() => remove(index)}>
              <Delete />
            </button>
          </div>
        );
      })}
      <div>
        <button type='button' onClick={handleClickAddIntakeTime}>
          時間を追加
          <Add />
        </button>
      </div>
    </>
  );
}
