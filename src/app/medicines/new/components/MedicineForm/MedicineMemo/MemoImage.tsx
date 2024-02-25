import Image from 'next/image';
import { Image as ImageIcon, Delete } from '@mui/icons-material';
import { Dispatch, RefObject, SetStateAction } from 'react';

export default function MemoImage({
  fileInputRef,
  uploadedImage,
  setUploadedImage,
}: {
  fileInputRef: RefObject<HTMLInputElement>;
  uploadedImage: string | null;
  setUploadedImage: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <div>
      {uploadedImage ? (
        <div>
          <button
            type='button'
            onClick={() => {
              fileInputRef.current!.value = '';
              URL.revokeObjectURL(uploadedImage);
              setUploadedImage(null);
            }}
          >
            <Delete />
          </button>
          <Image src={uploadedImage} alt='Uploaded image' width={100} height={100} />
        </div>
      ) : (
        <button
          type='button'
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          <ImageIcon />
        </button>
      )}
      <input
        ref={fileInputRef}
        name='memo-image'
        type='file'
        accept='.jpg, .jpeg, .png, .gif'
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
          }
        }}
      />
    </div>
  );
}
