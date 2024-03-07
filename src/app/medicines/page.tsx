import MedicineList from './components/MedicineList';
import getMedicines from '../actions/getMedicines';
import { getImageUrlByIdServer } from '../api/lib/cloudinary';
import { MedicineWithRelationsAndImageUrl } from '@/types';

export default async function Page() {
  const medicines = await getMedicines();
  const medicinesWithImageUrl: MedicineWithRelationsAndImageUrl[] = await Promise.all(
    medicines.map(async (med) => {
      const memo = med.memo;
      if (!memo) return { ...med, memo: null };
      const imageUrl = await getImageUrlByIdServer(memo.imageId);
      return {
        ...med,
        memo: { id: memo.id, medicineId: memo.medicineId, text: memo.text, imageUrl },
      };
    }),
  );
  medicinesWithImageUrl.sort((a, b) => (a.isPaused === b.isPaused ? 0 : a.isPaused ? 1 : -1));

  return <MedicineList medicines={medicinesWithImageUrl} />;
}
