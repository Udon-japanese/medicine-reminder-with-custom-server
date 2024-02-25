import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function useMedicine() {
  const params = useParams();
  const pathname = usePathname();
  const NEW_MEDICINE_PATH = '/medicines/new';

  const medicineId = useMemo(() => {
    if (!params?.medicineId) {
      return '';
    }

    return params.medicineId as string;
  }, [params?.medicineId]);

  const isOpen = useMemo(
    () => !!medicineId || pathname === NEW_MEDICINE_PATH,
    [medicineId, pathname]
  );

  return useMemo(
    () => ({
      isOpen,
      medicineId,
    }),
    [isOpen, medicineId]
  );
}
