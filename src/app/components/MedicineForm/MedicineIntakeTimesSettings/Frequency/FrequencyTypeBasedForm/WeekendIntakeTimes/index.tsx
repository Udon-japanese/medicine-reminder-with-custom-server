import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { addHours, isDate, startOfHour } from 'date-fns';
import {
  get,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import TimePicker from '../../../../DateTimePicker/TimePicker';
import NumberInput from '@/app/components/NumberInput';
import { AlarmAddOutlined, Delete } from '@mui/icons-material';
import intakeTimesStyles from '@styles/components/medicineForm/medicineIntakeTimes.module.scss';
import { isInvalidDate } from '@/utils/isInvalidDate';
import inputWithLabelStyles from '@styles/components/inputWithLabel.module.scss';
import { useEffect, useState } from 'react';
import {
  getConvertedSpecificDaysOfWeek,
} from '@/utils/getMedicineText';
import SwitchButton from '@/app/components/SwitchButton';
import styles from '@styles/components/medicineForm/medicineIntakeTimesSettings/frequency/frequencyTypeBasedForm/weekendIntakeTimes/index.module.scss';
import SelectWeekendsModal from './SelectWeekendsModal';

export default function WeekendIntakeTimes() {
  const {
    control,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<MedicineForm>();
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'frequency.everyday.weekendIntakeTimes',
  });

  const weekendIntakeTimes = useWatch({
    control,
    name: 'frequency.everyday.weekendIntakeTimes',
  });
  const weekends = useWatch({ control, name: 'frequency.everyday.weekends' });
  const unit = useWatch({ control, name: 'unit' });
  const hasWeekendIntakeTimes = useWatch({
    control,
    name: 'frequency.everyday.hasWeekendIntakeTimes',
  });
  const lastWeekendIntakeTime = useWatch({
    control,
    name: `frequency.everyday.weekendIntakeTimes.${fields.length - 1}.time` as const,
  });
  const lastWeekendDosage = useWatch({
    control,
    name: `frequency.everyday.weekendIntakeTimes.${fields.length - 1}.dosage` as const,
  });
  const newIntakeTime =
    fields.length &&
    isDate(lastWeekendIntakeTime) &&
    !isInvalidDate(lastWeekendIntakeTime)
      ? addHours(lastWeekendIntakeTime, 4)
      : addHours(startOfHour(new Date()), 1);
  const newDosage = fields.length && lastWeekendDosage ? lastWeekendDosage : 1;
  const [showSelectWeekendsModal, setShowSelectWeekendsModal] = useState(false);

  const handleClickAddIntakeTime = () => {
    append({ time: newIntakeTime, dosage: newDosage.toString() });
    trigger('frequency.everyday.weekendIntakeTimes');
  };
  const handleToggleWeekendIntakeTimesChange = (newVal: boolean) => {
    if (newVal && !weekendIntakeTimes?.length) {
      setValue('frequency.everyday.weekendIntakeTimes', getValues('intakeTimes'));
      setValue('frequency.everyday.weekends', ['SATURDAY', 'SUNDAY']);
    }

    trigger('frequency');
  };

  useEffect(() => {
    if (weekendIntakeTimes?.length === 0) {
      setValue('frequency.everyday.hasWeekendIntakeTimes', false);
      trigger('frequency');
    }
  }, [weekendIntakeTimes, setValue, trigger]);

  return (
    <>
      <label className={styles.enableWeekendIntakeTimes}>
        <div>週末に別の服用時間を追加</div>
        <SwitchButton<MedicineForm>
          checked={hasWeekendIntakeTimes}
          name='frequency.everyday.hasWeekendIntakeTimes'
          onCheckedChange={handleToggleWeekendIntakeTimesChange}
        />
      </label>
      <SelectWeekendsModal showModal={showSelectWeekendsModal} setShowModal={setShowSelectWeekendsModal} />
      {hasWeekendIntakeTimes && (
        <div className={intakeTimesStyles.container}>
          <div className={styles.headerContainer}>
            {weekends?.length > 0 && (
              <div>{getConvertedSpecificDaysOfWeek(weekends)}</div>
            )}
            <button
              className={styles.editWeekendsButton}
              type='button'
              onClick={() => setShowSelectWeekendsModal(true)}
            >
              編集
            </button>
          </div>
          {fields.map((item, index) => {
            const dosageErr = get(
              errors,
              `frequency.everyday.weekendIntakeTimes.${index}.dosage`,
            )?.message;
            const intakeTimeErr = get(
              errors,
              `frequency.everyday.weekendIntakeTimes.${index}.time`,
            )?.message;

            return (
              <div key={item.id} className={intakeTimesStyles.intakeTimeContainer}>
                <div className={intakeTimesStyles.timePickerContainer}>
                  <TimePicker<MedicineForm>
                    name={`frequency.everyday.weekendIntakeTimes.${index}.time`}
                    triggerName='frequency.everyday.weekendIntakeTimes'
                    error={intakeTimeErr}
                  />
                </div>
                <div className={intakeTimesStyles.dosageContainer}>
                  <label
                    className={`${inputWithLabelStyles.inputContainer} ${dosageErr ? inputWithLabelStyles.isInvalid : inputWithLabelStyles.isValid}`}
                  >
                    <NumberInput<MedicineForm>
                      name={
                        `frequency.everyday.weekendIntakeTimes.${index}.dosage` as const
                      }
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
                      <div className={intakeTimesStyles.errMessage}>{dosageErr}</div>
                    </div>
                  )}
                </div>
                <button
                  type='button'
                  className={intakeTimesStyles.deleteIntakeTimeBtn}
                  onClick={() => {
                    remove(index);
                    trigger('frequency.everyday.weekendIntakeTimes');
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
              className={intakeTimesStyles.addIntakeTimeBtn}
              onClick={handleClickAddIntakeTime}
            >
              <AlarmAddOutlined
                fontSize='small'
                className={intakeTimesStyles.addIntakeTimeIcon}
              />
              時間を追加
            </button>
          </div>
        </div>
      )}
    </>
  );
}
