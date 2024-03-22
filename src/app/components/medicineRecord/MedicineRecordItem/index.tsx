'use client';
import { Popover } from '@/app/components/Popover';
import {
  MedicineRecordForm,
  medicineRecordFormSchema,
} from '@/types/zodSchemas/medicineRecordForm/schema';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import { Done } from '@mui/icons-material';
import { addMinutes, differenceInMinutes, format, isBefore, startOfDay } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { fetcher } from '@/utils';
import { MedicineWithDosageAndRecord, MedicineWithDosage } from '@/types';
import { useRouter } from 'next/navigation';
import { MedicineRecordType } from '../MedicineRecordList';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDefaultForm } from '@/lib/hookForm';
import styles from '@styles/components/medicineRecord/medicineRecordItem.module.scss';
import Spinner from '../../Spinner';
import MedicineRecordPopoverContent from '../MedicineRecordPopoverContent';
import { isMedicineWithRecord } from '../utils';

export default function MedicineRecordItem({
  intakeTime,
  medicinesWithDosage,
  currentDate,
  medicineRecordType,
}: {
  intakeTime: number;
  medicinesWithDosage: Array<MedicineWithDosage | MedicineWithDosageAndRecord>;
  currentDate: Date;
  medicineRecordType: MedicineRecordType;
}) {
  const [disabledActionAll, setDisabledActionAll] = useState(false);
  const router = useRouter();
  const intakeDate = addMinutes(
    startOfDay(
      medicineRecordType !== 'pending'
        ? (medicinesWithDosage as MedicineWithDosageAndRecord[])[0].record
            .actualIntakeDate
        : currentDate,
    ),
    intakeTime,
  );
  const values = useMemo(
    () => ({
      intakeDate,
      medicines: medicinesWithDosage.map(({ dosage, medicine }, i) => {
        let medicineRecordId: number | undefined;
        const med = medicinesWithDosage[i];
        if (isMedicineWithRecord(med)) {
          medicineRecordId = med.record.id;
        }
        return {
          dosage: dosage.toString(),
          medicineId: medicine.id,
          medicineRecordId,
          isSelected: true,
        };
      }),
    }),
    [intakeDate, medicinesWithDosage],
  );
  const formMethods = useDefaultForm<MedicineRecordForm>({
    resolver: zodResolver(medicineRecordFormSchema),
    mode: 'onBlur',
    shouldFocusError: false,
    defaultValues: {
      intakeDate: new Date(),
      medicines: [{ dosage: '0', medicineId: '', isSelected: false }],
    },
    values,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmitCompleteAll = async ({ medicines }: MedicineRecordForm) => {
    setDisabledActionAll(true);
    if (isSubmitting || disabledActionAll) return;
    await fetcher('/api/medicineRecords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduledIntakeDate: currentDate,
        scheduledIntakeTime: intakeTime,
        actualIntakeTime: intakeTime,
        actualIntakeDate: currentDate,
        medicines,
        isCompleted: true,
        isSkipped: false,
        isIntakeTimeScheduled: true,
      }),
    });

    router.refresh();
  };
  const onSubmitCancelAll = async ({ medicines }: MedicineRecordForm) => {
    setDisabledActionAll(true);
    if (isSubmitting || disabledActionAll) return;
    for (const medicine of medicines) {
      if (medicine.medicineRecordId) {
        await fetcher(`/api/medicineRecords/${medicine.medicineRecordId}`, {
          method: 'DELETE',
        });
      }
    }

    router.refresh();
  };
  const getMedicineStatus = useCallback(():
    | 'overdue'
    | 'near-expiry'
    | 'completed'
    | 'future' => {
    const now = new Date();
    const currDate = addMinutes(startOfDay(currentDate), intakeTime);
    const difference = differenceInMinutes(currDate, now);

    if (isBefore(currDate, now) && medicineRecordType === 'pending') {
      return 'overdue';
    } else if (difference >= 0 && difference <= 60 && medicineRecordType === 'pending') {
      return 'near-expiry';
    } else if (medicineRecordType !== 'pending') {
      return 'completed';
    } else {
      return 'future';
    }
  }, [intakeTime, currentDate, medicineRecordType]);

  const medicineStatus = getMedicineStatus();

  const getItemStatusClassName = useCallback(() => {
    switch (medicineStatus) {
      case 'overdue':
        return styles.overdue;
      case 'near-expiry':
        return styles.nearExpiry;
      case 'completed':
        return styles.completed;
      case 'future':
        return '';
    }
  }, [medicineStatus]);

  const getActionAllButtonClassName = () => {
    switch (medicineRecordType) {
      case 'completed':
        return styles.actionAllButtonCompleted;
      case 'skipped':
        return styles.actionAllButtonSkipped;
      case 'pending':
        return '';
    }
  };

  return (
    <FormProvider {...formMethods}>
      <div
        className={`${styles.itemContainer} ${getItemStatusClassName()} ${medicineRecordType === 'skipped' ? styles.itemSkipped : ''}`}
      >
        <button
          type='button'
          className={`${styles.actionAllButton} ${getActionAllButtonClassName()}`}
          onClick={() => {
            if (medicineRecordType === 'pending') {
              handleSubmit(onSubmitCompleteAll)();
            } else {
              handleSubmit(onSubmitCancelAll)();
            }
          }}
          disabled={disabledActionAll}
        >
          {isSubmitting ? (
            <Spinner
              className={`${styles.actionAllButtonSpinner} ${medicineRecordType !== 'pending' ? styles.actionAllButtonCompletedOrSkippedSpinner : ''}`}
            />
          ) : (
            <Done />
          )}
        </button>
        <MedicineRecordPopover
          intakeTime={intakeTime}
          medicinesWithDosage={medicinesWithDosage}
          currentDate={currentDate}
        />
      </div>
    </FormProvider>
  );
}

function MedicineRecordPopover({
  intakeTime,
  medicinesWithDosage,
  currentDate,
}: {
  intakeTime: number;
  medicinesWithDosage: Array<MedicineWithDosage | MedicineWithDosageAndRecord>;
  currentDate: Date;
}) {
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <Popover
      align='end'
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
      drawerClassName={styles.drawer}
      content={
        <MedicineRecordPopoverContent
          currentDate={currentDate}
          setOpenPopover={setOpenPopover}
          hasRecOrSchProps={{
            intakeTime,
            medicinesWithDosage,
          }}
        />
      }
    >
      <button type='button' className={styles.itemMedicineInfoContainer}>
        <div className={styles.time}>
          {format(convertMinutesAndDate(intakeTime), 'HH:mm')}
        </div>
        {medicinesWithDosage.map(({ medicine, dosage }, i) => (
          <div key={i} className={styles.itemMedicineContainer}>
            <div className={styles.itemMedicineName}>{medicine.name}</div>
            <div className={styles.itemMedicineDosage}>
              {dosage}
              {medicine.unit}
            </div>
          </div>
        ))}
      </button>
    </Popover>
  );
}
