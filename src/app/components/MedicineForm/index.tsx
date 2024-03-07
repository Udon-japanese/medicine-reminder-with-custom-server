'use client';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form';
import {
  MedicineForm as TMedicineForm,
  medicineFormSchema,
} from '@/types/zodSchemas/medicineForm/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useRef, useState } from 'react';
import { FieldArrayFormProvider } from '@/app/contexts/FieldArrayFormContext';
import MedicineNameInput from './MedicineNameInput';
import MedicineIntakeTimes from './MedicineIntakeTimes';
import MedicineIntakeTimesSettings from './MedicineIntakeTimesSettings';
import MedicineStock from './MedicineStock';
import { useDefaultForm, handleFormKeyDown } from '@/lib/hookForm';
import MedicineMemo from './MedicineMemo';
import MemoImage from './MedicineMemo/MemoImage';
import { fetcher } from '@/utils';
import { uploadImage } from '@/lib/cloudinary';
import { MedicineWithRelations } from '@/types';
import { convertMinutesAndDate } from '@/utils/convertMinutesAndDate';
import styles from '@styles/components/medicineForm/index.module.scss';
import { MedicineUnit as TMedicineUnit } from '@prisma/client';
import MedicineUnit from '@/app/components/MedicineForm/MedicineUnit';
import LinerProgress from '../LinerProgress';

export default function MedicineForm({
  medicineUnits,
  medicine,
  imageUrl,
}: {
  medicineUnits: TMedicineUnit[];
  medicine?: MedicineWithRelations;
  imageUrl?: string | null;
}) {
  const router = useRouter();
  const isEditMode = !!medicine;
  const [uploadedMemoImage, setUploadedMemoImage] = useState<null | string>(
    imageUrl ? imageUrl : null,
  );
  const [isDirtyMemoImage, setIsDirtyMemoImage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const memoImageInputRef = useRef<HTMLInputElement>(null);

  const values = useMemo(
    () => (isEditMode ? getValuesFromMedicine(medicine) : undefined),
    [medicine],
  );

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
      unit: medicineUnits[0]?.unit,
      stock: {
        manageStock: false,
      },
      memo: '',
    },
    values,
  });
  const {
    handleSubmit,
    control,
    formState: { isDirty: RHFIsDirty, isSubmitting: RHFIsSubmitting },
  } = formMethods;
  const fieldArrayMethods = useFieldArray({
    control,
    name: 'intakeTimes',
  });
  const isDirty = RHFIsDirty || isDirtyMemoImage;
  const isSubmitting = RHFIsSubmitting || isProcessing;

  const onSubmit: SubmitHandler<TMedicineForm> = async (data) => {
    const files = memoImageInputRef.current?.files;
    const existingImageId = medicine?.memo?.imageId;
    const imageId = await (async () => {
      if (files && files.length > 0) {
        const image = await uploadImage(files[0]);
        return image.id;
      }
      return existingImageId || null;
    })();

    const imageIdToDelete = imageUrl !== uploadedMemoImage ? existingImageId : null;

    const medicineForm: TMedicineForm =
      data.intakeTimes.length === 0
        ? { ...data, frequency: null, period: null, notify: null }
        : data;

    const apiEndpoint = isEditMode ? `/api/medicines/${medicine.id}` : '/api/medicines';
    const method = isEditMode ? 'PUT' : 'POST';

    await fetcher(apiEndpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId, imageIdToDelete, medicineForm }),
    });

    router.push('/medicines');
    router.refresh();
  };

  function getValuesFromMedicine(medicine: MedicineWithRelations): TMedicineForm {
    const { name, intakeTimes, frequency, period, notify, unit, stock, memo } = medicine;
    const hasIntakeTimes = intakeTimes.length > 0;

    return {
      name,
      intakeTimes: intakeTimes.map((t) => ({
        time: convertMinutesAndDate(t.time),
        dosage: t.dosage.toString(),
      })),
      frequency: !hasIntakeTimes ? null : getFrequency(),
      notify: !hasIntakeTimes ? null : notify,
      period: !hasIntakeTimes
        ? null
        : period?.days
          ? {
              hasDeadline: true,
              startDate: period.startDate,
              days: period.days.toString(),
            }
          : { hasDeadline: false, startDate: period?.startDate! },
      unit,
      stock: stock
        ? {
            manageStock: true,
            quantity: stock.quantity.toString(),
            autoConsume: stock.autoConsume,
          }
        : { manageStock: false },
      memo: memo?.text ? memo.text : undefined,
    };

    function getFrequency() {
      const freqType = frequency?.type!;

      switch (freqType) {
        case 'EVERYDAY':
          return { type: freqType };
        case 'EVERY_X_DAY':
          return { type: freqType, everyXDay: frequency?.everyXDay?.toString()! };
        case 'SPECIFIC_DAYS_OF_WEEK':
          return { type: freqType, specificDaysOfWeek: frequency?.specificDaysOfWeek! };
        case 'SPECIFIC_DAYS_OF_MONTH':
          return { type: freqType, specificDaysOfMonth: frequency?.specificDaysOfMonth! };
        case 'ODD_EVEN_DAY':
          return { type: freqType, isOddDay: frequency?.oddEvenDay?.isOddDay! };
        case 'ON_OFF_DAYS':
          return {
            type: freqType,
            onDays: frequency?.onOffDays?.onDays.toString()!,
            offDays: frequency?.onOffDays?.offDays.toString()!,
          };
      }
    }
  }

  const handleDeleteMedicine = async () => {
    setIsProcessing(true);
    const deleteMedicineId = medicine?.id;
    await fetcher(`/api/medicines/${deleteMedicineId}`, {
      method: 'DELETE',
    });

    setIsProcessing(false);
    router.push('/medicines');
    router.refresh();
  };

  const handleUpdateIsPaused = async () => {
    setIsProcessing(true);
    const existingMedicineId = medicine?.id;
    await fetcher(`/api/medicines/${existingMedicineId}/togglePause`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaused: !medicine?.isPaused }),
    });

    setIsProcessing(false);
    router.push('/medicines');
    router.refresh();
  };

  return (
    <div className={styles.container}>
      <div className={styles.mobileHeaderContainer}>
        <LinerProgress show={isSubmitting} className={styles.mobileLinerProgress} />
        <button type='button' onClick={router.back}>
          <div className={styles.headerIconContainer}>
            <ArrowBack />
          </div>
        </button>
        <div className={styles.headerText}>お薬を{isEditMode ? '編集' : '追加'}</div>
      </div>
      <LinerProgress show={isSubmitting} className={styles.desktopLinerProgress} />
      <div className={styles.formContainer}>
        <div className={styles.desktopHeaderContainer}>
          お薬を{isEditMode ? '編集' : '登録'}
        </div>
        <FormProvider {...formMethods}>
          <FieldArrayFormProvider {...formMethods} {...fieldArrayMethods}>
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown}>
              <MedicineNameInput />
              <MedicineIntakeTimes />
              <MedicineIntakeTimesSettings />
              <MedicineUnit medicineUnits={medicineUnits} />
              <MedicineStock />
              <MedicineMemo
                MemoImage={
                  <MemoImage
                    uploadedImage={uploadedMemoImage}
                    setUploadedImage={setUploadedMemoImage}
                    fileInputRef={memoImageInputRef}
                    setIsDirty={setIsDirtyMemoImage}
                  />
                }
              />
              {isEditMode ? (
                <div className={styles.buttonsContainer}>
                  <div className={styles.buttonContainer}>
                    <button
                      className={styles.submitButton}
                      type='submit'
                      disabled={!isDirty || isSubmitting}
                    >
                      更新
                    </button>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      className={`${styles.pauseRestartButton} ${medicine?.isPaused ? styles.isRestartButton : ''}`}
                      type='button'
                      disabled={isSubmitting}
                      onClick={handleUpdateIsPaused}
                    >
                      {medicine?.isPaused ? '再開' : '停止'}
                    </button>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      type='button'
                      className={styles.deleteButton}
                      onClick={handleDeleteMedicine}
                      disabled={isSubmitting}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.buttonContainer}>
                  <button type='submit' disabled={isSubmitting} className={styles.submitButton}>
                    登録
                  </button>
                </div>
              )}
            </form>
          </FieldArrayFormProvider>
        </FormProvider>
      </div>
    </div>
  );
}
