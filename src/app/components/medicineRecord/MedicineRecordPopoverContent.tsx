import DateTimePicker from './MedicineRecordForm/DateTimePicker';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import styles from '@styles/components/medicineRecord/medicineRecordPopoverContent.module.scss';
import inputWithLabelStyles from '@styles/components/inputWithLabel.module.scss';
import { useRouter } from 'next/navigation';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { MedicineRecordForm } from '@/types/zodSchemas/medicineRecordForm/schema';
import { fetcher } from '@/utils';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import { addMinutes, isEqual, startOfDay, startOfSecond } from 'date-fns';
import {
  MedicineWithDosage,
  MedicineWithDosageAndRecord,
  MedicineWithRelations,
} from '@/types';
import CheckButton from '../CheckButton';
import NumberInput from '../NumberInput';
import { EventRepeat, Today } from '@mui/icons-material';
import { isEditMode } from './utils';
import Spinner from '../Spinner';

export default function MedicineRecordPopoverContent({
  setOpenPopover,
  currentDate,
  hasRecOrSchProps,
  anyProps,
}: {
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
  currentDate: Date;
  hasRecOrSchProps?: {
    intakeTime: number;
    medicinesWithDosage: (MedicineWithDosage | MedicineWithDosageAndRecord)[];
  };
  anyProps?: {
    existingMedicines: MedicineWithRelations[];
  };
}) {
  const router = useRouter();
  const {
    control,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
  } = useFormContext<MedicineRecordForm>();
  const { fields } = useFieldArray({ control, name: 'medicines' });
  const intakeDate = useWatch({ control, name: 'intakeDate' });
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingSkip, setIsLoadingSkip] = useState(false);
  const [isLoadingCompleteAny, setIsLoadingCompleteAny] = useState(false);
  const isNotDirtyExceptIsSelected = !(
    dirtyFields.intakeDate || dirtyFields.medicines?.some((m) => m.dosage)
  );
  const isNotDirtyIsSelected = !dirtyFields.medicines?.some((m) => m.isSelected);

  const closePopover = () => {
    setOpenPopover(false);
  };
  const onSubmitCompleteOrSkip = async ({
    data,
    type,
  }: {
    data: MedicineRecordForm;
    type: 'complete' | 'skip';
  }) => {
    if (isSubmitting) return;
    if (type === 'complete') {
      setIsLoadingComplete(true);
    } else {
      setIsLoadingSkip(true);
    }

    const { intakeDate, medicines } = data;
    const selectedMedicines = medicines.filter((medicine) => medicine.isSelected);

    await fetcher('/api/medicineRecords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduledIntakeDate: currentDate,
        scheduledIntakeTime: hasRecOrSchProps?.intakeTime,
        actualIntakeTime: convertMinutesAndDate(intakeDate),
        actualIntakeDate: startOfDay(intakeDate),
        medicines: selectedMedicines,
        isCompleted: type === 'complete',
        isSkipped: type === 'skip',
        isIntakeTimeScheduled: true,
      }),
    });

    if (type === 'complete') {
      setIsLoadingComplete(false);
    } else {
      setIsLoadingSkip(false);
    }

    closePopover();
    router.refresh();
  };

  const onSubmitCancel = async ({ medicines }: MedicineRecordForm) => {
    if (isSubmitting) return;
    setIsLoadingCancel(true);

    const selectedMedicines = medicines.filter((medicine) => medicine.isSelected);

    for (const medicine of selectedMedicines) {
      if (medicine.medicineRecordId) {
        await fetcher(`/api/medicineRecords/${medicine.medicineRecordId}`, {
          method: 'DELETE',
        });
      }
    }

    setIsLoadingCancel(false);
    closePopover();
    router.refresh();
  };
  const onSubmitEdit = async ({ medicines, intakeDate }: MedicineRecordForm) => {
    if (isSubmitting || isNotDirtyExceptIsSelected) return;
    setIsLoadingEdit(true);

    const selectedMedicines = medicines.filter((medicine) => medicine.isSelected);

    for (const medicine of selectedMedicines) {
      if (medicine.medicineRecordId) {
        await fetcher(`/api/medicineRecords/${medicine.medicineRecordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actualIntakeTime: convertMinutesAndDate(intakeDate),
            actualIntakeDate: startOfDay(intakeDate),
            dosage: medicine.dosage,
          }),
        });
      }
    }

    setIsLoadingEdit(false);
    closePopover();
    router.refresh();
  };
  const onSubmitCompleteAny = async ({ intakeDate, medicines }: MedicineRecordForm) => {
    if (isSubmitting || isNotDirtyIsSelected) return;
    setIsLoadingCompleteAny(true);

    const selectedMedicines = medicines.filter((medicine) => medicine.isSelected);

    await fetcher('/api/medicineRecords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actualIntakeTime: convertMinutesAndDate(intakeDate),
        actualIntakeDate: startOfDay(intakeDate),
        medicines: selectedMedicines,
        isCompleted: true,
        isSkipped: false,
        isIntakeTimeScheduled: false,
      }),
    });

    setIsLoadingCompleteAny(false);
    setOpenPopover(false);
    router.refresh();
  };
  const isIntakeDateEqual = useCallback(() => {
    if (!hasRecOrSchProps) return false;

    return isEqual(
      startOfSecond(addMinutes(startOfDay(currentDate), hasRecOrSchProps.intakeTime)),
      startOfSecond(intakeDate),
    );
  }, [hasRecOrSchProps, intakeDate, currentDate]);

  const medicinesErr = errors.medicines?.root?.message || errors?.medicines?.message;

  return (
    <>
      {fields.length > 0 && (
        <>
          {medicinesErr && (
            <div className={styles.medicinesErrMessageContainer}>
              <div className={styles.errMessage}>{medicinesErr}</div>
            </div>
          )}
          <div className={styles.medicineList}>
            {fields.map((field, index) => {
              const medicine = hasRecOrSchProps
                ? hasRecOrSchProps.medicinesWithDosage[index].medicine
                : anyProps?.existingMedicines[index];

              if (!medicine) return null;

              const dosageErr = errors?.medicines?.[index]?.dosage?.message;
              const dosageMax = medicine.stock?.quantity || 1000;

              return (
                <div key={field.id} className={styles.medicineItem}>
                  <CheckButton<MedicineRecordForm>
                    name={`medicines.${index}.isSelected`}
                    onCheckChange={() => trigger('medicines')}
                    className={
                      hasRecOrSchProps && isEditMode(hasRecOrSchProps.medicinesWithDosage)
                        ? styles.isCheckButtonCancel
                        : ''
                    }
                  />
                  <div className={styles.medicineInfoContainer}>
                    <div className={styles.medicineName}>{medicine.name}</div>
                    <div className={styles.dosageContainer}>
                      <label
                        className={`${inputWithLabelStyles.inputContainer} ${dosageErr ? inputWithLabelStyles.isInvalid : inputWithLabelStyles.isValid}`}
                      >
                        <NumberInput<MedicineRecordForm>
                          name={`medicines.${index}.dosage` as const}
                          max={dosageMax}
                          error={dosageErr}
                          decimalPlaces={2}
                          placeholder='0.00'
                          className={inputWithLabelStyles.input}
                          disableStyles
                          displayErrMessage={false}
                        />
                        <div className={inputWithLabelStyles.label}>{medicine.unit}</div>
                      </label>
                      {dosageErr && (
                        <div className={inputWithLabelStyles.errContainer}>
                          <div className={styles.errMessage}>{dosageErr}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <button
        type='button'
        onClick={() => setOpenDateTimePicker(true)}
        className={styles.dateTimePickerLabel}
      >
        時間
      </button>
      <div className={styles.dateTimePickerContainer}>
        <DateTimePicker open={openDateTimePicker} setOpen={setOpenDateTimePicker} />
        {hasRecOrSchProps && (
          <button
            type='button'
            onClick={() => {
              if (isIntakeDateEqual()) {
                setValue('intakeDate', new Date());
              } else {
                setValue(
                  'intakeDate',
                  addMinutes(startOfDay(currentDate), hasRecOrSchProps.intakeTime),
                );
              }
            }}
            className={styles.toggleIntakeDateButton}
          >
            {isIntakeDateEqual() ? <Today /> : <EventRepeat />}
          </button>
        )}
      </div>
      {hasRecOrSchProps ? (
        <div
          className={`${styles.actionButtonsContainer} ${styles.isActionButtonsContainerGrid}`}
        >
          {isEditMode(hasRecOrSchProps.medicinesWithDosage) ? (
            <>
              <button
                className={styles.cancelButton}
                type='button'
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmitCancel)}
              >
                取り消し
                <ActionButtonSpinner show={isLoadingCancel} />
              </button>
              <button
                type='button'
                disabled={isSubmitting || isNotDirtyExceptIsSelected}
                className={styles.submitButton}
                onClick={handleSubmit(onSubmitEdit)}
              >
                編集
                <ActionButtonSpinner show={isLoadingEdit} />
              </button>
            </>
          ) : (
            <>
              <button
                type='button'
                disabled={isSubmitting}
                onClick={handleSubmit((data) =>
                  onSubmitCompleteOrSkip({ data, type: 'skip' }),
                )}
                className={styles.skipButton}
              >
                スキップ
                <ActionButtonSpinner show={isLoadingSkip} />
              </button>
              <button
                type='button'
                disabled={isSubmitting}
                onClick={handleSubmit((data) =>
                  onSubmitCompleteOrSkip({ data, type: 'complete' }),
                )}
                className={styles.submitButton}
              >
                服用
                <ActionButtonSpinner show={isLoadingComplete} />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.actionButtonsContainer}>
          <button
            type='button'
            disabled={isSubmitting || isNotDirtyIsSelected}
            className={styles.submitButton}
            onClick={handleSubmit(onSubmitCompleteAny)}
          >
            服用
            <ActionButtonSpinner show={isLoadingCompleteAny} />
          </button>
        </div>
      )}
    </>
  );
}

function ActionButtonSpinner({ show }: { show: boolean }) {
  return show && <Spinner className={styles.actionButtonSpinner} />;
}
