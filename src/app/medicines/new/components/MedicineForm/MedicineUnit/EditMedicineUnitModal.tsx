import ErrorMessage from '@/app/components/ErrorMessage';
import Modal from '@/app/components/Modal';
import TextInput from '@/app/components/TextInput';
import { handleFormKeyDown, useDefaultForm } from '@/lib/hookForm';
import {
  MedicineUnitForm,
  medicineUnitFormSchema }
from '@/types/zodSchemas/medicineForm/schema';
import { fetcher } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBack, Delete } from '@mui/icons-material';
import { MedicineUnit } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form';

export default function EditMedicineUnitModal({
  showModal,
  setShowModal,
  medicineUnits,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  medicineUnits: MedicineUnit[];
}) {
  const router = useRouter();
  const formMethods = useDefaultForm<MedicineUnitForm>({
    resolver: zodResolver(medicineUnitFormSchema),
    mode: 'onBlur',
    shouldFocusError: false,
    defaultValues: {
      units: [],
    },
    values: {
      units: medicineUnits.map((u) => ({ unit: u.unit })),
    },
  });
  const { control, handleSubmit, trigger } = formMethods;
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'units',
  });

  const onSubmit: SubmitHandler<MedicineUnitForm> = async ({ units: newMedUnits }) => {
    const medUnitsToDelete = medicineUnits.filter((unit) => {
      const u = unit.unit;
      return !newMedUnits.map((nU) => nU.unit).includes(u);
    });
    const medUnitsToAdd = newMedUnits.filter(
      (unit) => !medicineUnits.map((u) => u.unit).includes(unit.unit),
    );

    if (medUnitsToDelete.length > 0) {
      await fetcher('/api/medicineUnits', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medUnitsToDelete),
      });
    }

    if (medUnitsToAdd.length > 0) {
      const addedMedUnits = await fetcher<MedicineUnit[]>('/api/medicineUnits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ units: medUnitsToAdd }),
      });
    }

    router.refresh();
    setShowModal(false);
  };
  const onClose = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      onClose={onClose}
      fullScreenOnMobile
    >
      <form onKeyDown={handleFormKeyDown}>
        <FormProvider {...formMethods}>
          <button onClick={onClose} type='button'>
            <ArrowBack />
          </button>
          単位を編集
          {fields.map((field, index) => {
            return (
              <div key={field.id}>
                <TextInput<MedicineUnitForm>
                  name={`units.${index}.unit` as const}
                  max={20}
                  onBlur={() => trigger('units')}
                />
                <button
                  type='button'
                  onClick={() => {
                    if (fields.length === 1) return;
                    remove(index);
                    trigger('units');
                  }}
                >
                  <Delete />
                </button>
                <ErrorMessage<MedicineUnitForm> name={`units.${index}` as const} />
              </div>
            );
          })}
          <button onClick={() => append({ unit: '' })} type='button'>
            追加
          </button>
        </FormProvider>
      </form>
    </Modal>
  );
}
