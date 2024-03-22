import { MedicineWithDosage, MedicineWithDosageAndRecord } from '@/types';

export const isMedicineWithRecord = (
  medicine: MedicineWithDosage | MedicineWithDosageAndRecord,
): medicine is MedicineWithDosageAndRecord => {
  return 'record' in medicine;
};
export const isEditMode = (
  medicines: Array<MedicineWithDosage | MedicineWithDosageAndRecord>,
): medicines is MedicineWithDosageAndRecord[] => medicines.every(isMedicineWithRecord);
