import Modal from '@/app/components/Modal';
import { MedicineForm } from '@/types/zodSchemas/medicineForm/schema';
import { getDayOfWeekText } from '@/utils/getMedicineText';
import { Close, Done } from '@mui/icons-material';
import { DayOfWeek } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import styles from '@styles/components/medicineForm/medicineIntakeTimesSettings/frequency/frequencyTypeBasedForm/weekendIntakeTimes/selectWeekendsModal.module.scss';
import Header from '@/app/components/Header';

export default function SelectWeekendsModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const daysOfWeek = Object.values(DayOfWeek);
  const { control, setValue, trigger } = useFormContext<MedicineForm>();
  const weekends = useWatch({ control, name: 'frequency.everyday.weekends' });
  const onClose = () => {
    setShowModal(false);

    if (weekends?.length === 7 || weekends?.length === 0) {
      setValue('frequency.everyday.hasWeekendIntakeTimes', false);
      setValue('frequency.everyday.weekends', ['SATURDAY', 'SUNDAY']);
      trigger('frequency');
    }
  };
  const handleDayOfWeekClick = (dayOfWeek: DayOfWeek) => {
    const newDaysOfWeek = weekends?.includes(dayOfWeek)
      ? weekends?.filter((d: DayOfWeek) => d !== dayOfWeek)
      : [...(weekends ?? []), dayOfWeek];
    return newDaysOfWeek.sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));
  };

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      onClose={onClose}
      fullScreenOnMobile
    >
      <div className={styles.container}>
        <Header headerText='編集' action={onClose} actionIcon={<Close />} />
        <Controller
          name='frequency.everyday.weekends'
          control={control}
          render={({ field: { onChange } }) => (
            <div className={styles.selectDayOfWeekButtonContainer}>
              {daysOfWeek.map((dayOfWeek, index) => (
                <button
                  key={index}
                  type='button'
                  className={styles.selectDayOfWeekButton}
                  onClick={() => {
                    onChange(handleDayOfWeekClick(dayOfWeek));
                    trigger('frequency.specificDaysOfWeek');
                  }}
                >
                  {getDayOfWeekText(dayOfWeek)}
                  {weekends?.includes(dayOfWeek) && <Done />}
                </button>
              ))}
            </div>
          )}
        />
      </div>
    </Modal>
  );
}
