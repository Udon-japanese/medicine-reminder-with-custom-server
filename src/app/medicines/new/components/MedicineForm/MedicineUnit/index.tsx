'use client';
import { Popover } from '@/app/components/Popover';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { MedicineUnit, MedicineUnit as TMedicineUnit } from '@prisma/client';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Edit } from '@mui/icons-material';
import SelectMedicineUnitButton from './SelectMedicineUnitButton';
import EditMedicineUnitModal from './EditMedicineUnitModal';
import ErrorMessage from '@/app/components/ErrorMessage';

export default function MedicineUnit({
  medicineUnits,
}: {
  medicineUnits: TMedicineUnit[];
}) {
  const [openPopover, setOpenPopover] = useState(false);
  const [showEditMedicineUnitModal, setShowEditMedicineUnitModal] = useState(false);
  const { control } = useFormContext<MedicineForm>();
  const unit = useWatch({ control, name: 'unit' });

  return (
    <div>
      <Popover
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        content={
          <div>
            <div>単位</div>
            <div>
              <Controller
                control={control}
                name='unit'
                render={({ field }) => (
                  <div>
                    {medicineUnits.map((medUnit) => (
                      <SelectMedicineUnitButton
                        key={medUnit.id}
                        medUnit={medUnit}
                        {...field}
                      />
                    ))}
                    <button
                      type='button'
                      onClick={() => setShowEditMedicineUnitModal(true)}
                    >
                      単位を編集
                      <Edit />
                    </button>
                    <EditMedicineUnitModal
                      showModal={showEditMedicineUnitModal}
                      setShowModal={setShowEditMedicineUnitModal}
                      medicineUnits={medicineUnits}
                    />
                  </div>
                )}
              />
            </div>
            <ErrorMessage<MedicineForm> name='unit' />
          </div>
        }
      >
        <button type='button'>単位: {unit}</button>
      </Popover>
    </div>
  );
}
