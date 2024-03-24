import getMedicineById from '@/app/actions/getMedicineById';
import getMedicineRecords from '@/app/actions/getMedicineRecords';
import getMedicines from '@/app/actions/getMedicines';
import { MedicineRecord } from '@prisma/client';

export default async function getExistingMedicinesWithRecords() {
  const medicines = await getMedicines();
  const medRecs = await getMedicineRecords();
  const medicineRecords = await Promise.all(
    medRecs.map(async (medRec) => {
      const m = await getMedicineById(medRec.medicineId);
      return m ? medRec : null;
    }),
  );

  return {
    medicines,
    medicineRecords: medicineRecords.filter((m): m is MedicineRecord => m !== null),
  };
}
