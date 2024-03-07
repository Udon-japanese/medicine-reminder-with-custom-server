import getMedicineById from '@/app/actions/getMedicineById';
import getMedicineUnits from '@/app/actions/getMedicineUnits';
import { getImageUrlByIdServer } from '@/app/api/lib/cloudinary';
import MedicineForm from '@/app/components/MedicineForm';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { medicineId: string } }) {
  const { medicineId } = params;
  const medicine = await getMedicineById(medicineId);

  if (!medicine) redirect('/medicines');

  const medicineUnits = await getMedicineUnits();
  const imageUrl = await getImageUrlByIdServer(medicine?.memo?.imageId);

  return (
    <MedicineForm medicine={medicine} imageUrl={imageUrl} medicineUnits={medicineUnits} />
  );
}
