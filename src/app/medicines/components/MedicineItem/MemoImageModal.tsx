import Modal from '@/app/components/Modal';
import { MedicineWithRelationsAndImageUrl } from '@/types';
import { CloseRounded } from '@mui/icons-material';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import styles from '@styles/components/medicines/medicineItem/memoImageModal.module.scss';

export default function MemoImageModal({
  showMemoImageModal,
  setShowMemoImageModal,
  memo,
}: {
  showMemoImageModal: boolean;
  setShowMemoImageModal: Dispatch<SetStateAction<boolean>>;
  memo: MedicineWithRelationsAndImageUrl['memo'];
}) {
  return (
    <Modal
      showModal={showMemoImageModal}
      setShowModal={setShowMemoImageModal}
      fullScreenOnMobile
      dialogClassName={styles.content}
    >
      <button
        type='button'
        className={styles.closeButton}
        onClick={() => setShowMemoImageModal(false)}
      >
        <CloseRounded />
      </button>
      {memo?.imageUrl && (
        <TransformWrapper>
          <TransformComponent>
            <Image
              src={memo.imageUrl}
              alt='メモ画像'
              width={500}
              height={500}
              sizes='100vw'
              className={styles.image}
            />
          </TransformComponent>
        </TransformWrapper>
      )}
    </Modal>
  );
}
