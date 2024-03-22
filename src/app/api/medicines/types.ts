import { convertMedicineForm } from './utils';

type ReturnTypeOfConvertMedicineForm = ReturnType<typeof convertMedicineForm>;
export type GetMedicineData = {
  convertedMedicine: ReturnTypeOfConvertMedicineForm;
  userId: string;
  imageId: string | undefined;
};
