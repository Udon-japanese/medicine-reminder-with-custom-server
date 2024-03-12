import Modal from '@/app/components/Modal';
import TextInput from '@/app/components/TextInput';
import { handleFormKeyDown, useDefaultForm } from '@/lib/hookForm';
import {
  MedicineUnitForm,
  medicineUnitFormSchema,
} from '@/types/zodSchemas/medicineForm/schema';
import { fetcher } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Close, Delete, Add } from '@mui/icons-material';
import { MedicineUnit } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form';
import styles from '@styles/components/medicineForm/medicineUnit/editMedicineUnitModal.module.scss';
import LinerProgress from '../../LinerProgress';

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
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = formMethods;
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'units',
  });
  const isOnlyOneUnit = fields.length === 1;

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
      await fetcher<MedicineUnit[]>('/api/medicineUnits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ units: medUnitsToAdd }),
      });
    }

    setShowModal(false);
    router.refresh();
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
          <div className={styles.container}>
            <LinerProgress show={isSubmitting} className={styles.desktopLinerProgress} />
            <div className={styles.formContainer}>
              <div className={styles.desktopHeaderContainer}>
                <div>単位を編集</div>
                <button
                  className={styles.desktopCloseButtonContainer}
                  onClick={onClose}
                  type='button'
                >
                  <Close fontSize='medium' />
                </button>
              </div>
              <div className={styles.mobileHeaderContainer}>
                <LinerProgress
                  show={isSubmitting}
                  className={styles.mobileLinerProgress}
                />
                <button
                  className={styles.mobileCloseButtonContainer}
                  onClick={onClose}
                  type='button'
                >
                  <Close />
                </button>
                <div className={styles.mobileHeaderText}>単位を編集</div>
              </div>
              <div className={styles.unitsContainer}>
                {fields.map((field, index) => {
                  const err = errors?.units?.[index]?.unit?.message;
                  return (
                    <div key={field.id} className={styles.unitContainer}>
                      <div className={styles.inputContainer}>
                        <TextInput<MedicineUnitForm>
                          name={`units.${index}.unit` as const}
                          max={10}
                          onBlur={() => trigger('units')}
                          error={err}
                          displayErrMessage={false}
                          displayOverflow={false}
                        />
                        <button
                          type='button'
                          className={`${styles.deleteButton} ${isOnlyOneUnit || isSubmitting ? styles.isDeleteButtonDisabled : ''}`}
                          disabled={isSubmitting}
                          onClick={() => {
                            if (isOnlyOneUnit) return;
                            remove(index);
                            trigger('units');
                          }}
                        >
                          <Delete />
                        </button>
                      </div>
                      <div>{err && <div className={styles.errMessage}>{err}</div>}</div>
                    </div>
                  );
                })}
                <button
                  className={styles.addUnitButton}
                  onClick={() => append({ unit: '' })}
                  disabled={isSubmitting}
                  type='button'
                >
                  <Add fontSize='inherit' />
                  <div>追加</div>
                </button>
              </div>
            </div>
          </div>
        </FormProvider>
      </form>
    </Modal>
  );
}
