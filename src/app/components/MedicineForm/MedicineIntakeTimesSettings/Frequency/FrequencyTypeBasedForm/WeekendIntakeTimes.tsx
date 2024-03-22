import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { addHours, isDate, startOfHour } from 'date-fns';
import {
  Controller,
  get,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import TimePicker from '../../../DateTimePicker/TimePicker';
import NumberInput from '@/app/components/NumberInput';
import { AlarmAddOutlined, Close, Delete, Done } from '@mui/icons-material';
import styles from '@styles/components/medicineForm/medicineIntakeTimes.module.scss';
import { isInvalidDate } from '@/utils/isInvalidDate';
import inputWithLabelStyles from '@styles/components/inputWithLabel.module.scss';
import { useEffect, useState } from 'react';
import Modal from '@/app/components/Modal';
import { DayOfWeek } from '@prisma/client';
import { getDayOfWeekText } from '@/utils/getMedicineText';
import SwitchButton from '@/app/components/SwitchButton';

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
  const daysOfWeek = Object.values(DayOfWeek);
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
  const [showWeekendsSettingModal, setShowWeekendsSettingModal] = useState(false);

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
  const handleDayOfWeekClick = (dayOfWeek: DayOfWeek) => {
    const newDaysOfWeek = weekends?.includes(dayOfWeek)
      ? weekends?.filter((d: DayOfWeek) => d !== dayOfWeek)
      : [...(weekends ?? []), dayOfWeek];
    return newDaysOfWeek.sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));
  };

  const onCloseWeekendsSettingModal = () => {
    setShowWeekendsSettingModal(false);

    if (weekends?.length === 7 || weekends?.length === 0) {
      setValue('frequency.everyday.hasWeekendIntakeTimes', false);
      setValue('frequency.everyday.weekends', ['SATURDAY', 'SUNDAY']);
      trigger('frequency');
    }
  };

  useEffect(() => {
    if (weekendIntakeTimes?.length === 0) {
      setValue('frequency.everyday.hasWeekendIntakeTimes', false);
      trigger('frequency');
    }
  }, [weekendIntakeTimes, setValue, trigger]);

  return (
    <>
      <SwitchButton<MedicineForm>
        checked={hasWeekendIntakeTimes}
        name='frequency.everyday.hasWeekendIntakeTimes'
        onCheckedChange={handleToggleWeekendIntakeTimesChange}
      />
      <Modal
        showModal={showWeekendsSettingModal}
        setShowModal={setShowWeekendsSettingModal}
        onClose={onCloseWeekendsSettingModal}
        fullScreenOnMobile
      >
        <button type='button' onClick={onCloseWeekendsSettingModal}>
          <Close />
        </button>
        <Controller
          name='frequency.everyday.weekends'
          control={control}
          render={({ field: { onChange } }) => (
            <>
              {daysOfWeek.map((dayOfWeek, index) => (
                <div key={index}>
                  <button
                    type='button'
                    onClick={() => {
                      onChange(handleDayOfWeekClick(dayOfWeek));
                      trigger('frequency.specificDaysOfWeek');
                    }}
                  >
                    {getDayOfWeekText(dayOfWeek)}
                    {weekends?.includes(dayOfWeek) && <Done />}
                  </button>
                </div>
              ))}
            </>
          )}
        />
      </Modal>
      {hasWeekendIntakeTimes && (
        <div className={styles.container}>
          <button type='button' onClick={() => setShowWeekendsSettingModal(true)}>
            編集
          </button>
          <div className={styles.labelContainer}>
            {weekends?.length > 0 && (
              <div>{weekends.map((w) => getDayOfWeekText(w))}</div>
            )}
            <div className={styles.timeLabel}>時間</div>
            {fields.length > 0 && <div className={styles.dosageLabel}>服用量</div>}
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
              <div key={item.id} className={styles.intakeTimeContainer}>
                <div className={styles.timePickerContainer}>
                  <TimePicker<MedicineForm>
                    name={`frequency.everyday.weekendIntakeTimes.${index}.time`}
                    triggerName='frequency.everyday.weekendIntakeTimes'
                    error={intakeTimeErr}
                  />
                </div>
                <div className={styles.dosageContainer}>
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
                      <div className={styles.errMessage}>{dosageErr}</div>
                    </div>
                  )}
                </div>
                <button
                  type='button'
                  className={styles.deleteIntakeTimeBtn}
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
              className={styles.addIntakeTimeBtn}
              onClick={handleClickAddIntakeTime}
            >
              <AlarmAddOutlined fontSize='small' className={styles.addIntakeTimeIcon} />
              時間を追加
            </button>
          </div>
        </div>
      )}
    </>
  );
}
