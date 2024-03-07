import { useFieldArrayFormContext } from '@/app/contexts/FieldArrayFormContext';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { addHours, startOfHour } from 'date-fns';
import { useFormContext, useWatch } from 'react-hook-form';
import TimePicker from '../MedicineForm/DateTimePicker/TimePicker';
import NumberInput from '@/app/components/NumberInput';
import { AlarmAddOutlined, Delete } from '@mui/icons-material';
import styles from '@styles/components/medicineForm/medicineIntakeTimes.module.scss';
import { isInvalidDate } from '@/utils/isInvalidDate';
import inputWithLabelStyles from '@styles/components/medicineForm/input-with-label.module.scss';

export default function MedicineIntakeTimes() {
  const { fields, remove, append } = useFieldArrayFormContext<MedicineForm>();
  const {
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext<MedicineForm>();

  const unit = useWatch({ control, name: 'unit' });
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
    fields.length && lastIntakeTime && !isInvalidDate(lastIntakeTime)
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
    trigger('intakeTimes');
  };

  return (
    <div className={styles.container}>
      <div className={styles.labelContainer}>
        <div className={styles.timeLabel}>時間</div>
        {fields.length > 0 && <div className={styles.dosageLabel}>服用量</div>}
      </div>
      {fields.map((item, index) => {
        const dosageErr = errors?.intakeTimes?.[index]?.dosage?.message;
        return (
          <div key={item.id} className={styles.intakeTimeContainer}>
            <div className={styles.timePickerContainer}>
              <TimePicker index={index} />
            </div>
            <div className={styles.dosageContainer}>
              <label
                className={`${inputWithLabelStyles.inputContainer} ${dosageErr ? inputWithLabelStyles.isInvalid : inputWithLabelStyles.isValid}`}
              >
                <NumberInput<MedicineForm>
                  name={`intakeTimes.${index}.dosage` as const}
                  max={1000}
                  error={dosageErr}
                  decimalPlaces={2}
                  placeholder='0.00'
                  className={unit ? inputWithLabelStyles.input : ''}
                  disableStyles
                  displayErrMessage={false}
                />
                {unit && <div className={inputWithLabelStyles.label}>{unit}</div>}
              </label>
              {dosageErr && (
                <div className={inputWithLabelStyles.errContainer}>
                  <div className={styles.errMessage}>{dosageErr}</div>
                </div>
              )}
            </div>
            <button
              type='button'
              className={styles.deleteIntakeTimeBtn}
              onClick={() => {
                remove(index);
                trigger('intakeTimes');
              }}
            >
              <Delete />
            </button>
          </div>
        );
      })}
      <div>
        <button
          type='button'
          className={styles.addIntakeTimeBtn}
          onClick={handleClickAddIntakeTime}
        >
          <AlarmAddOutlined fontSize='small' className={styles.addIntakeTimeIcon} />
          時間を追加
        </button>
      </div>
    </div>
  );
}
