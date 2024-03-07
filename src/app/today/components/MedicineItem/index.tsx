'use client';
import CheckButton from '@/app/components/CheckButton';
import { Popover } from '@/app/components/Popover';
import { FieldArrayFormProvider } from '@/app/contexts/FieldArrayFormContext';
import { useDefaultForm } from '@/lib/hookForm';
import { MedicineWithRelations } from '@/types';
import {
  MedicineRecordForm,
  medicineRecordFormSchema,
} from '@/types/zodSchemas/medicineRecord/schema';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import { zodResolver } from '@hookform/resolvers/zod';
import { Done } from '@mui/icons-material';
import { addMinutes, format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useWatch } from 'react-hook-form';
import DateTimePicker from './DateTimePicker';

export default function MedicineItem({
  time,
  medicinesWithDosage,
}: {
  time: number;
  medicinesWithDosage: { dosage: number; medicine: MedicineWithRelations }[];
}) {
  const [openPopover, setOpenPopover] = useState(false);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const values = useMemo(
    () => ({
      intakeTime: time,
      intakeDate: addMinutes(new Date(), time),
      intakenMedicines: medicinesWithDosage.map(({ dosage, medicine }) => ({
        dosage,
        medicineId: medicine.id,
        isIntaken: true,
      })),
    }),
    [time, medicinesWithDosage],
  );
  const formMethods = useDefaultForm<MedicineRecordForm>({
    resolver: zodResolver(medicineRecordFormSchema),
    mode: 'onBlur',
    shouldFocusError: false,
    defaultValues: {
      intakeTime: 0,
      intakeDate: new Date(),
      intakenMedicines: [{ dosage: 0, medicineId: '', isIntaken: true }],
    },
    values,
  });
  const { control } = formMethods;
  const fieldArrayMethods = useFieldArray({
    control,
    name: 'intakenMedicines',
  });
  const { fields } = fieldArrayMethods;
  const intakenMedicines = useWatch({ control, name: 'intakenMedicines' });
  const intakeDate = useWatch({ control, name: 'intakeDate' });

  useEffect(() => {
    console.log(intakenMedicines);
    console.log(intakeDate);
  }, [intakenMedicines, intakeDate]);

  return (
    <>
      <div>
        <button type='button'>
          <Done />
        </button>
      </div>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        isDrawerFullHeight
        content={
          <FormProvider {...formMethods}>
            <FieldArrayFormProvider {...formMethods} {...fieldArrayMethods}>
              {fields.length > 0 &&
                fields.map((field, index) => {
                  const { medicine, dosage } = medicinesWithDosage[index];

                  return (
                    <div key={field.id}>
                      <CheckButton<MedicineRecordForm>
                        name={`intakenMedicines.${index}.isIntaken`}
                      />
                      {medicine.name} {dosage}
                      {medicine.unit}
                    </div>
                  );
                })}
              <DateTimePicker open={openDateTimePicker} setOpen={setOpenDateTimePicker} />
              <button type='button'>スキップ</button>
              <button type='button'>服用</button>
            </FieldArrayFormProvider>
          </FormProvider>
        }
        align='end'
      >
        <button type='button'>
          <div>{format(convertMinutesAndDate(time), 'HH:mm')}</div>
          {medicinesWithDosage.map(({ medicine, dosage }, i) => (
            <div key={i}>
              {medicine.name} {dosage}
              {medicine.unit}
            </div>
          ))}
        </button>
      </Popover>
      <br />
    </>
  );
}
