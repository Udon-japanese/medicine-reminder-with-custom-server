'use client';
import { Popover } from '@/app/components/Popover';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { MedicineUnit, MedicineUnit as TMedicineUnit } from '@prisma/client';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import SelectMedicineUnitButton from './SelectMedicineUnitButton';
import EditMedicineUnitModal from './EditMedicineUnitModal';
import styles from '@styles/components/medicineForm/medicineUnit/index.module.scss';
import useMediaQuery from '@/app/hooks/useMediaQuery';

export default function MedicineUnit({
  medicineUnits,
}: {
  medicineUnits: TMedicineUnit[];
}) {
  const [openPopover, setOpenPopover] = useState(false);
  const [showEditMedicineUnitModal, setShowEditMedicineUnitModal] = useState(false);
  const { control } = useFormContext<MedicineForm>();
  const unit = useWatch({ control, name: 'unit' });
  const { isMd } = useMediaQuery();

  return (
    <div className={styles.container}>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        align='end'
        drawerClassName={styles.drawer}
        content={
          <div className={styles.popoverContainer}>
            <div className={styles.drawerHeaderContainer}>
              <div className={styles.drawerHeader}>単位</div>
              <button
                className={styles.drawerEditUnitButton}
                type='button'
                onClick={() => setShowEditMedicineUnitModal(true)}
              >
                編集
              </button>
            </div>
            <Controller
              control={control}
              name='unit'
              render={({ field }) => (
                <div className={styles.medicineUnitsContainer}>
                  {medicineUnits.map((medUnit) => (
                    <SelectMedicineUnitButton
                      key={medUnit.id}
                      medUnit={medUnit}
                      setOpenPopover={setOpenPopover}
                      {...field}
                    />
                  ))}
                </div>
              )}
            />
            {isMd && (
              <button
                className={styles.popoverEditUnitButton}
                type='button'
                onClick={() => setShowEditMedicineUnitModal(true)}
              >
                編集
              </button>
            )}
            <EditMedicineUnitModal
              showModal={showEditMedicineUnitModal}
              setShowModal={setShowEditMedicineUnitModal}
              medicineUnits={medicineUnits}
            />
          </div>
        }
      >
        <button type='button' className={styles.labelContainer}>
          <div>単位</div>
          <div>{unit}</div>
        </button>
      </Popover>
    </div>
  );
}
