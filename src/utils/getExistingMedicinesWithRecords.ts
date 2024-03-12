import getMedicineById from '@/app/actions/getMedicineById';
import getMedicineRecords from '@/app/actions/getMedicineRecords';
import getMedicines from '@/app/actions/getMedicines';

export default async function getExistingMedicinesWithRecords() {
  const medicines = await getMedicines();
  const medRecs = await getMedicineRecords();
  const medicineRecords = medRecs.filter(async (record) => {
    const m = await getMedicineById(record.medicineId);
    if (!m) return false;
  });

  return {
    medicines,
    medicineRecords,
  }
}
