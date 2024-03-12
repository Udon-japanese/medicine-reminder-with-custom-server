'use client';
import { MedicineWithRelations } from '@/types';
import MedicineRecordList from '../MedicineRecordList';
import { FormProvider, useFieldArray } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { useDefaultForm } from '@/lib/hookForm';
import {
  MedicineRecordForm,
  medicineRecordFormSchema,
} from '@/types/zodSchemas/medicineRecord/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover } from '../../Popover';
import DateTimePicker from './DateTimePicker';
import NumberInput from '../../NumberInput';
import CheckButton from '../../CheckButton';
import { fetcher } from '@/utils';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import { format, isToday, startOfDay } from 'date-fns';
import { useRouter } from 'next/navigation';
import { MedicineRecord } from '@prisma/client';
import useIntakeTimes from '@/app/hooks/useIntakeTimes';

export default function MedicineRecordForm({
  medicineRecords,
  currentDate,
  existingMedicines,
}: {
  medicineRecords: MedicineRecord[];
  existingMedicines: MedicineWithRelations[];
  currentDate: Date;
}) {
  const router = useRouter();
  const medicineRecordListProps = {
    currentDate,
  };
  const [openPopover, setOpenPopover] = useState(false);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const { scheduledMedicines, pendingTimes, completedTimes, skippedTimes } =
    useIntakeTimes({ currentDate, existingMedicines, medicineRecords });

  const values = useMemo(
    () => ({
      intakeDate: new Date(),
      medicines: scheduledMedicines.map((medicine) => ({
        dosage: medicine.intakeTimes[0]?.dosage?.toString() || '1',
        medicineId: medicine.id,
        isSelected: false,
      })),
    }),
    [scheduledMedicines],
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
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = formMethods;
  const fieldArrayMethods = useFieldArray({
    control,
    name: 'medicines',
  });
  const { fields } = fieldArrayMethods;

  const onSubmit = async ({ intakeDate, medicines }: MedicineRecordForm) => {
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

    setOpenPopover(false);
    router.refresh();
  };

  return (
    <FormProvider {...formMethods}>
      <Popover
        align='end'
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        content={
          <>
            <div>お薬</div>
            {fields.length > 0 &&
              fields.map((field, index) => {
                const medicine = existingMedicines[index];
                const dosageErr = errors?.medicines?.[index]?.dosage?.message;

                return (
                  <div key={field.id}>
                    <CheckButton<MedicineRecordForm>
                      name={`medicines.${index}.isSelected`}
                    />
                    <div>{medicine.name}</div>
                    <NumberInput<MedicineRecordForm>
                      name={`medicines.${index}.dosage`}
                      max={1000}
                      decimalPlaces={2}
                      error={dosageErr}
                    />
                    {medicine.unit}
                  </div>
                );
              })}
            <DateTimePicker open={openDateTimePicker} setOpen={setOpenDateTimePicker} />
            {isDirty ? (
              <button type='button' onClick={handleSubmit(onSubmit)}>
                登録
              </button>
            ) : (
              <div>だめ</div>
            )}
          </>
        }
      >
        <button type='button'>任意の薬を登録</button>
      </Popover>
      <div>{isToday(currentDate) ? '今日' : format(currentDate, 'M月d日')}</div>
      {completedTimes.length === 0 &&
      pendingTimes.length === 0 &&
      skippedTimes.length === 0 ? (
        <div>お薬記録はありません</div>
      ) : (
        <>
          {pendingTimes.length > 0 && (
            <>
              <div>まだ飲んでない</div>
              <MedicineRecordList
                {...medicineRecordListProps}
                intakeTimes={pendingTimes}
              />
            </>
          )}
          <br />
          <br />
          <br />
          {completedTimes.length > 0 && (
            <>
              <div>飲んだ</div>
              <MedicineRecordList
                {...medicineRecordListProps}
                intakeTimes={completedTimes}
                medicineRecordType='completed'
              />
            </>
          )}
          <br />
          <br />
          <br />
          {skippedTimes.length > 0 && (
            <>
              <div>スキップした</div>
              <MedicineRecordList
                {...medicineRecordListProps}
                intakeTimes={skippedTimes}
                medicineRecordType='skipped'
              />
            </>
          )}
        </>
      )}
    </FormProvider>
  );
}
