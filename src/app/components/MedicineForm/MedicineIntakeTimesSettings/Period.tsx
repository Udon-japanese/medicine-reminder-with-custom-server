import { Popover } from '@/app/components/Popover';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import DatePicker from '../../MedicineForm/DateTimePicker/DatePIcker';
import SwitchButton from '@/app/components/SwitchButton';
import NumberInput from '@/app/components/NumberInput';
import { formatPeriod } from '@/utils/formatPeriod';
import styles from '@/styles/components/medicineForm/medicineIntakeTimesSettings/period.module.scss';
import inputWithLabelStyles from '@styles/components/medicineForm/input-with-label.module.scss';
import useErrorMessage from '@/app/hooks/useErrorMessage';
import { isInvalidDate } from '@/utils/isInvalidDate';
import { addDays, format } from 'date-fns';

export default function Period() {
  const { control, setValue, trigger, getValues } = useFormContext<MedicineForm>();
  const period = useWatch({ control, name: 'period' });
  const [openPopover, setOpenPopover] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const daysErr = useErrorMessage<MedicineForm>('period.days');
  const isValidDays =
    period?.hasDeadline && period?.days && period?.days?.trim() !== '' && Number.isInteger(Number(period?.days));
  const isValidStartDate = period?.startDate && !isInvalidDate(period?.startDate);

  return (
    <div>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        align='end'
        drawerClassName={styles.drawer}
        content={
          <div className={styles.container}>
            <div className={styles.drawerHeader}>期間</div>
            <div className={styles.datePickerContainer}>
              <div
                className={styles.datePickerLabel}
                onClick={() => setOpenDatePicker(true)}
              >
                開始日
              </div>
              <DatePicker open={openDatePicker} setOpen={setOpenDatePicker} />
            </div>
            <label htmlFor='hasDeadline' className={styles.hasDeadlineLabelContainer}>
              <div>期限を設ける</div>
              <SwitchButton<MedicineForm>
                name='period.hasDeadline'
                id='hasDeadline'
                onCheckedChange={() => {
                  if (!getValues('period.days')) {
                    setValue('period.days', `${30}`);
                    trigger('period.days');
                  }
                }}
              />
            </label>
            {period?.hasDeadline && (
              <div className={styles.daysContainer}>
                <div className={styles.daysLabel}>何日間</div>
                <label
                  className={`${inputWithLabelStyles.inputContainer} ${daysErr ? inputWithLabelStyles.isInvalid : inputWithLabelStyles.isValid}`}
                >
                  <NumberInput<MedicineForm>
                    name='period.days'
                    max={1000}
                    min={1}
                    placeholder='1~1000'
                    error={daysErr}
                    disableStyles
                    displayErrMessage={false}
                    className={inputWithLabelStyles.input}
                  />
                  {isValidStartDate && isValidDays && (
                    <div className={inputWithLabelStyles.label}>
                      {format(
                        addDays(period.startDate, Number(period?.days!)),
                        '~ yyyy/M/d',
                      )}
                    </div>
                  )}
                </label>
                {daysErr && (
                  <div className={inputWithLabelStyles.errContainer}>
                    <div className={styles.errMessage}>{daysErr}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        }
      >
        <button type='button' className={styles.labelContainer}>
          <div>期間:</div>
          <div>
            {formatPeriod({
              startDate: period?.startDate,
              hasDeadline: period?.hasDeadline,
              days: period?.hasDeadline ? period?.days : undefined,
            })}
          </div>
        </button>
      </Popover>
    </div>
  );
}
