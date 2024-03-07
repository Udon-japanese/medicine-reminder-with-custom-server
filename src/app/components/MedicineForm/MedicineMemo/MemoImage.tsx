import Image from 'next/image';
import { Image as ImageIcon, Delete } from '@mui/icons-material';
import { Dispatch, RefObject, SetStateAction } from 'react';
import styles from '@styles/components/medicineForm/medicineMemo/memoImage.module.scss';

export default function MemoImage({
  fileInputRef,
  uploadedImage,
  setUploadedImage,
  setIsDirty,
}: {
  fileInputRef: RefObject<HTMLInputElement>;
  uploadedImage: string | null;
  setUploadedImage: Dispatch<SetStateAction<string | null>>;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={styles.container}>
      {uploadedImage ? (
        <div className={styles.imageContainer}>
          <button
            type='button'
            className={styles.deleteUploadedImageBtn}
            onClick={() => {
              fileInputRef.current!.value = '';
              URL.revokeObjectURL(uploadedImage);
              setUploadedImage(null);
              setIsDirty(true);
            }}
          >
            <Delete fontSize='small' />
          </button>
          <div className={styles.uploadedImageContainer}>
            <Image
              src={uploadedImage}
              alt='Uploaded image'
              width={50}
              height={50}
              className={styles.uploadedImage}
            />
          </div>
        </div>
      ) : (
        <button
          type='button'
          onClick={() => {
            fileInputRef.current?.click();
          }}
          className={styles.imagePlaceholder}
        >
          <ImageIcon />
        </button>
      )}
      <input
        ref={fileInputRef}
        name='memo-image'
        type='file'
        accept='.jpg, .jpeg, .png, .gif, .bmp, .svg, .webp'
        style={{ display: 'none' }}
        onChange={(e) => {
          const files = e.target.files;

          if (files && files.length > 0) {
            const file = files[0]!;
            if (file.size > 5242880) {
              console.error('Image is bigger than 5MB');
              return;
            }
            setUploadedImage(URL.createObjectURL(files[0]!));
            setIsDirty(true);
          }
        }}
      />
    </div>
  );
}
