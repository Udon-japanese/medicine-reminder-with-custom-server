'use client';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form';
import {
  MedicineForm as TMedicineForm,
  medicineFormSchema,
} from '@/types/zodSchemas/medicineForm/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useRef, useState } from 'react';
import { FieldArrayFormProvider } from '@/app/contexts/FieldArrayFormContext';
import MedicineNameInput from './MedicineNameInput';
import MedicineIntakeTimes from './MedicineIntakeTimes';
import MedicineIntakeTimesSettings from './MedicineIntakeTimesSettings';
import MedicineStock from './MedicineStock';
import { useDefaultForm, handleFormKeyDown } from '@/lib/hookForm';
import MedicineMemo from './MedicineMemo';
import MemoImage from './MedicineMemo/MemoImage';
import { fetcher } from '@/utils';
import uploadImage from '@/lib/cloudinary';

export default function MedicineForm({ MedicineUnit }: { MedicineUnit: ReactNode }) {
  const router = useRouter();
  const [uploadedMemoImage, setUploadedMemoImage] = useState<null | string>(null);
  const memoImageInputRef = useRef<HTMLInputElement>(null);

  const formMethods = useDefaultForm<TMedicineForm>({
    resolver: zodResolver(medicineFormSchema),
    mode: 'onBlur',
    shouldFocusError: false,
    defaultValues: {
      name: '',
      intakeTimes: [],
      frequency: null,
      notify: null,
      period: null,
      unit: '',
      stock: {
        manageStock: false,
      },
      memo: '',
    },
  });
  const { handleSubmit, control } = formMethods;
  const fieldArrayMethods = useFieldArray({
    control,
    name: 'intakeTimes',
  });

  const onSubmit: SubmitHandler<TMedicineForm> = async (data) => {
    const files = memoImageInputRef.current?.files;

    const imageUrl = await (async () => {
      if (files && files.length > 0) {
        const image = await uploadImage(files[0]);
        return image.url;
      }
      return '';
    })();
    const medicine: TMedicineForm =
      data.intakeTimes.length === 0
        ? { ...data, frequency: null, period: null, notify: null }
        : data;

    await fetcher('/api/medicines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, medicine }),
    });

    router.push('/medicines');
  };

  return (
    <>
      <button type='button' onClick={router.back}>
        <ArrowBack />
      </button>
      <h1>お薬を登録する</h1>
      <FormProvider {...formMethods}>
        <FieldArrayFormProvider {...formMethods} {...fieldArrayMethods}>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown}>
            <MedicineNameInput />
            <MedicineIntakeTimes />
            <MedicineIntakeTimesSettings />
            {MedicineUnit}
            <MedicineStock />
            <MedicineMemo
              MemoImage={
                <MemoImage
                  uploadedImage={uploadedMemoImage}
                  setUploadedImage={setUploadedMemoImage}
                  fileInputRef={memoImageInputRef}
                />
              }
            />
            <button type='submit'>登録</button>
          </form>
        </FieldArrayFormProvider>
      </FormProvider>
    </>
  );
}
