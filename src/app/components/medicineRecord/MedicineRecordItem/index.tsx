'use client';
import CheckButton from '@/app/components/CheckButton';
import { Popover } from '@/app/components/Popover';
import {
  MedicineRecordForm,
  medicineRecordFormSchema,
} from '@/types/zodSchemas/medicineRecord/schema';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import { Done } from '@mui/icons-material';
import { addMinutes, format, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';
import { FormProvider, useFieldArray } from 'react-hook-form';
import DateTimePicker from '../MedicineRecordForm/DateTimePicker';
import { fetcher } from '@/utils';
import { MedicineWithDosageAndRecord, MedicineWithDosage } from '@/types';
import { useRouter } from 'next/navigation';
import NumberInput from '../../NumberInput';
import { MedicineRecordType } from '../MedicineRecordList';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDefaultForm } from '@/lib/hookForm';

export default function MedicineRecordItem({
  time,
  medicines,
  currentDate,
  medicineRecordType,
}: {
  time: number;
  medicines: Array<MedicineWithDosage | MedicineWithDosageAndRecord>;
  currentDate: Date;
  medicineRecordType: MedicineRecordType;
}) {
  const initialIntakeDate = addMinutes(
    medicineRecordType !== 'pending'
      ? (medicines as MedicineWithDosageAndRecord[])[0].record.actualIntakeDate
      : startOfDay(currentDate),
    time,
  );
  const isMedicineWithRecord = (
    medicine: MedicineWithDosage | MedicineWithDosageAndRecord,
  ): medicine is MedicineWithDosageAndRecord => {
    return 'record' in medicine;
  };
  const isEditMode = (
    medicines: Array<MedicineWithDosage | MedicineWithDosageAndRecord>,
  ): medicines is MedicineWithDosageAndRecord[] => medicines.every(isMedicineWithRecord);
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState(false);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const values = useMemo(
    () => ({
      intakeDate: initialIntakeDate,
      medicines: medicines.map(({ dosage, medicine }, i) => {
        let medicineRecordId: number | undefined;
        const med = medicines[i];
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
    [time, medicines],
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
  const { fields } = useFieldArray({ control, name: 'medicines' });

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
    const { intakeDate, medicines } = data;
    const selectedMedicines = medicines.filter((medicine) => medicine.isSelected);

    await fetcher('/api/medicineRecords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduledIntakeDate: currentDate,
        scheduledIntakeTime: time,
        actualIntakeTime: convertMinutesAndDate(intakeDate),
        actualIntakeDate: startOfDay(intakeDate),
        medicines: selectedMedicines,
        isCompleted: type === 'complete',
        isSkipped: type === 'skip',
        isIntakeTimeScheduled: true,
      }),
    });

    closePopover();
    router.refresh();
  };

  const onSubmitUndo = async ({ medicines }: MedicineRecordForm) => {
    const selectedMedicines = medicines.filter((medicine) => medicine.isSelected);

    for (const medicine of selectedMedicines) {
      if (medicine.medicineRecordId) {
        await fetcher(`/api/medicineRecords/${medicine.medicineRecordId}`, {
          method: 'DELETE',
        });
      }
    }

    closePopover();
    router.refresh();
  };
  const onSubmitEdit = async ({ medicines }: MedicineRecordForm) => {
    const selectedMedicines = medicines.filter((medicine) => medicine.isSelected);

    for (const medicine of selectedMedicines) {
      if (medicine.medicineRecordId) {
        await fetcher(`/api/medicineRecords/${medicine.medicineRecordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actualIntakeTime: convertMinutesAndDate(currentDate),
            actualIntakeDate: startOfDay(currentDate),
            dosage: medicine.dosage,
          }),
        });
      }
    }

    closePopover();
    router.refresh();
  };
  const onSubmitCompleteAll = async ({ medicines }: MedicineRecordForm) => {
    await fetcher('/api/medicineRecords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheduledIntakeDate: currentDate,
        scheduledIntakeTime: time,
        actualIntakeTime: time,
        actualIntakeDate: currentDate,
        medicines,
        isCompleted: true,
        isSkipped: false,
        isIntakeTimeScheduled: true,
      }),
    });

    router.refresh();
  };

  return (
    <FormProvider {...formMethods}>
      <div>
        <button
          type='button'
          onClick={handleSubmit(onSubmitCompleteAll)}
        >
          <Done />
        </button>
      </div>
      <Popover
        align='end'
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        content={
          <>
            {fields.length > 0 &&
              fields.map((field, index) => {
                const medicineWithDosage = medicines[index];

                if (!medicineWithDosage) return null;
                const { medicine } = medicineWithDosage;
                const dosageErr = errors?.medicines?.[index]?.dosage?.message;

                return (
                  <div key={field.id}>
                    <CheckButton<MedicineRecordForm>
                      name={`medicines.${index}.isSelected`}
                    />
                    <div>{medicine.name}</div>
                    <div>
                      <NumberInput<MedicineRecordForm>
                        name={`medicines.${index}.dosage` as const}
                        max={1000}
                        decimalPlaces={2}
                        error={dosageErr}
                      />
                      {medicine.unit}
                    </div>
                    <br />
                  </div>
                );
              })}
            <div>時間</div>
            <DateTimePicker open={openDateTimePicker} setOpen={setOpenDateTimePicker} />
            {isEditMode(medicines) ? (
              <>
                <button type='button' onClick={handleSubmit(onSubmitUndo)}>
                  取り消し
                </button>
                {isDirty ? (
                  <button type='button' onClick={handleSubmit(onSubmitEdit)}>
                    編集
                  </button>
                ) : (
                  <div>だめ</div>
                )}
              </>
            ) : (
              <>
                <button
                  type='button'
                  onClick={handleSubmit((data) =>
                    onSubmitCompleteOrSkip({ data, type: 'skip' }),
                  )}
                  style={{ marginRight: 200 }}
                >
                  スキップ
                </button>
                <button
                  type='button'
                  onClick={handleSubmit((data) =>
                    onSubmitCompleteOrSkip({ data, type: 'complete' }),
                  )}
                >
                  服用
                </button>
              </>
            )}
          </>
        }
      >
        <button type='button'>
          <div>{format(convertMinutesAndDate(time), 'HH:mm')}</div>
          {medicines.map(({ medicine, dosage }, i) => (
            <div key={i}>
              {medicine.name} {dosage}
              {medicine.unit}
            </div>
          ))}
        </button>
      </Popover>
      <br />
    </FormProvider>
  );
}
