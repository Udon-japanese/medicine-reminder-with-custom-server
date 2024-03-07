import Image from 'next/image';
import * as Accordion from '@radix-ui/react-accordion';
import { MedicineWithRelationsAndImageUrl } from '@/types';
import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { ExpandMore } from '@mui/icons-material';
import styles from '@styles/components/medicines/medicineItem/memo.module.scss';
import useMediaQuery from '@/app/hooks/useMediaQuery';

export default function Memo({
  memo,
  setShowModal,
}: {
  memo: MedicineWithRelationsAndImageUrl['memo'];
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const text = memo?.text;
  const imageUrl = memo?.imageUrl;
  const { isMd } = useMediaQuery();

  const handleClickImage: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  if (isMd) {
    return (
      <div className={styles.memoContainer}>
        <div className={styles.memoLabel}>メモ</div>
        <div className={styles.memoContainer}>
          {imageUrl && (
            <button type='button' onClick={handleClickImage}>
              <div className={styles.imageContainer}>
                <Image
                  src={imageUrl}
                  alt='メモ画像'
                  fill
                  sizes='50vw'
                  className={styles.image}
                />
              </div>
            </button>
          )}
          {text && <div className={styles.memoText}>{text}</div>}
        </div>
      </div>
    );
  }

  return (
    <>
      <Accordion.Root type='multiple'>
        <Accordion.Item value='memo'>
          <Accordion.Trigger
            className={styles.accordionTrigger}
            onClick={(e) => e.stopPropagation()}
          >
            メモ
            <ExpandMore fontSize='inherit' className={styles.accordionChevron} />
          </Accordion.Trigger>
          <Accordion.Content className={styles.accordionContent}>
            <div className={styles.accordionMemoContainer}>
              {imageUrl && (
                <button type='button' onClick={handleClickImage}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={imageUrl}
                      alt='メモ画像'
                      fill
                      sizes='50vw'
                      className={styles.image}
                    />
                  </div>
                </button>
              )}
              {text && <div className={styles.accordionMemoText}>{text}</div>}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
}
