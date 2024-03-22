'use client';
import { MedicineWithRelations } from '@/types';
import MedicineRecordList from '../MedicineRecordList';
import { FormProvider } from 'react-hook-form';
import { useCallback, useMemo, useState } from 'react';
import { useDefaultForm } from '@/lib/hookForm';
import {
  MedicineRecordForm as TMedicineRecordForm,
  medicineRecordFormSchema,
} from '@/types/zodSchemas/medicineRecordForm/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover } from '../../Popover';
import {
  addHours,
  addMinutes,
  format,
  getHours,
  getMinutes,
  isToday,
  startOfDay,
} from 'date-fns';
import { MedicineRecord } from '@prisma/client';
import useIntakeTimes from '@/app/hooks/useIntakeTimes';
import styles from '@styles/components/medicineRecord/medicineRecordForm.module.scss';
import { Done, Add } from '@mui/icons-material';
import MedicineRecordPopoverContent from '../MedicineRecordPopoverContent';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function MedicineRecordForm({
  medicineRecords,
  currentDate,
  existingMedicines,
}: {
  medicineRecords: MedicineRecord[];
  existingMedicines: MedicineWithRelations[];
  currentDate: Date;
}) {
  const pathname = usePathname();
  const isTodayPage = pathname === '/today';
  const emptyStateMessage = isTodayPage
    ? '本日飲むお薬はありません'
    : 'お薬記録はありません';
  const [openPopover, setOpenPopover] = useState(false);
  const { pendingTimes, completedTimes, skippedTimes, getMedicinesStatus } =
    useIntakeTimes({ currentDate, existingMedicines, medicineRecords });
  const showEmptyState =
    completedTimes.length === 0 && pendingTimes.length === 0 && skippedTimes.length === 0;
  const medicinesStatus = getMedicinesStatus();
  const values = useMemo(() => {
    const now = new Date();

    return {
      intakeDate: addMinutes(
        addHours(startOfDay(currentDate), getHours(now)),
        getMinutes(now),
      ),
      medicines: existingMedicines.map((medicine) => ({
        dosage: medicine.intakeTimes[0]?.dosage?.toString() || '1',
        medicineId: medicine.id,
        isSelected: false,
      })),
    };
  }, [currentDate, existingMedicines]);
  const formMethods = useDefaultForm<TMedicineRecordForm>({
    resolver: zodResolver(medicineRecordFormSchema),
    mode: 'onBlur',
    shouldFocusError: false,
    defaultValues: {
      intakeDate: new Date(),
      medicines: [{ dosage: '0', medicineId: '', isSelected: false }],
    },
    values,
  });

  const getMedicinesStatusClassName = useCallback(() => {
    switch (medicinesStatus) {
      case 'future':
        return styles.future;
      case 'no-completed':
        return styles.noCompleted;
      case 'some-completed':
        return styles.someCompleted;
      case 'all-completed':
        return styles.allCompleted;
      case 'no-intake-times':
        return '';
    }
  }, [medicinesStatus]);

  return (
    <FormProvider {...formMethods}>
      <div
        className={`${styles.container} ${isTodayPage && showEmptyState ? styles.isTodayPageContainer : ''}`}
      >
        <Popover
          align='end'
          openPopover={openPopover}
          setOpenPopover={setOpenPopover}
          content={
            <MedicineRecordPopoverContent
              setOpenPopover={setOpenPopover}
              currentDate={currentDate}
              anyProps={{
                existingMedicines,
              }}
            />
          }
        >
          <button className={styles.newRecordButton} type='button'>
            <Add fontSize='inherit' />
          </button>
        </Popover>
        <div className={styles.headerContainer}>
          {medicinesStatus !== 'no-intake-times' && (
            <div
              className={`${styles.medicinesStatus} ${getMedicinesStatusClassName()}`}
            />
          )}
          <div>{isToday(currentDate) ? '今日' : format(currentDate, 'M月d日')}</div>
        </div>
        {showEmptyState ? (
          <div
            className={`${styles.emptyContainer} ${!isTodayPage ? styles.isCalendarPageEmptyContainer : ''}`}
          >
            <Image
              src='/empty.png'
              alt={emptyStateMessage}
              width={563}
              height={165}
              sizes='100vw'
              className={styles.emptyImage}
              priority
            />
            <div>{emptyStateMessage}</div>
          </div>
        ) : (
          <>
            {pendingTimes.length > 0 && (
              <MedicineRecordList currentDate={currentDate} intakeTimes={pendingTimes} />
            )}
            {(completedTimes.length > 0 || skippedTimes.length > 0) && (
              <div className={styles.completedOrSkippedTimesContainer}>
                <div className={styles.doneTextContainer}>
                  <Done fontSize='inherit' />
                  <div>完了</div>
                </div>
                {completedTimes.length > 0 && (
                  <MedicineRecordList
                    currentDate={currentDate}
                    intakeTimes={completedTimes}
                    medicineRecordType='completed'
                  />
                )}
                {skippedTimes.length > 0 && (
                  <MedicineRecordList
                    currentDate={currentDate}
                    intakeTimes={skippedTimes}
                    medicineRecordType='skipped'
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </FormProvider>
  );
}
