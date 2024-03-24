import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { addHours, isDate, startOfHour } from 'date-fns';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import TimePicker from '../MedicineForm/DateTimePicker/TimePicker';
import NumberInput from '@/app/components/NumberInput';
import { AlarmAddOutlined, Delete } from '@mui/icons-material';
import styles from '@styles/components/medicineForm/medicineIntakeTimes.module.scss';
import { isInvalidDate } from '@/utils/isInvalidDate';
import inputWithLabelStyles from '@styles/components/inputWithLabel.module.scss';
import { DayOfWeek } from '@prisma/client';
import { getConvertedSpecificDaysOfWeek } from '@/utils/getMedicineText';

export default function MedicineIntakeTimes() {
  const {
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'intakeTimes',
  });
  const unit = useWatch({ control, name: 'unit' });
  const frequency = useWatch({ control, name: 'frequency' });
  const period = useWatch({ control, name: 'period' });
  const notify = useWatch({ control, name: 'notify' });
  const weekends = useWatch({ control, name: 'frequency.everyday.weekends' });
  const hasWeekendIntakeTimes = useWatch({control, name: 'frequency.everyday.hasWeekendIntakeTimes'});
  const lastIntakeTime = useWatch({
    control,
    name: `intakeTimes.${fields.length - 1}.time` as const,
  });
  const lastDosage = useWatch({
    control,
    name: `intakeTimes.${fields.length - 1}.dosage` as const,
  });
  const newIntakeTime =
    fields.length && isDate(lastIntakeTime) && !isInvalidDate(lastIntakeTime)
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
      setValue('frequency.everyday.hasWeekendIntakeTimes', false);
      setValue('period', { startDate: new Date(), hasDeadline: false });
      setValue('notify', true);
      trigger(['frequency', 'period', 'notify']);
    }
    
    append({
      time: newIntakeTime,
      dosage: newDosage.toString(),
    });
    trigger('intakeTimes');
  };
  const getWeekdays = () => {
    if (!weekends?.length) return;
    const weekdays = Object.values(DayOfWeek).filter((day) => !weekends.includes(day));
    return getConvertedSpecificDaysOfWeek(weekdays);
  }
  const weekdays = getWeekdays();

  return (
    <div className={styles.container}>
      {weekdays && hasWeekendIntakeTimes && <div>{weekdays}</div>}
      {fields.map((item, index) => {
        const dosageErr = errors?.intakeTimes?.[index]?.dosage?.message;
        const intakeTimeErr = errors?.intakeTimes?.[index]?.time?.message;

        return (
          <div key={item.id} className={styles.intakeTimeContainer}>
            <div className={styles.timePickerContainer}>
              <TimePicker<MedicineForm>
                name={`intakeTimes.${index}.time`}
                triggerName='intakeTimes'
                error={intakeTimeErr}
              />
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
