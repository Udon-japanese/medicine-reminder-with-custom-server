import { fetcher } from '@/utils';

type SignData = {
  apiKey: string;
  timestamp: string;
  signature: string;
  folder: string;
  cloudName: string;
};

export async function getImageUrlByIdClient(imageId: string | null | undefined) {
  if (!imageId) return null;

  const signData = await fetcher<SignData>('/api/sign-cloudinary', { method: 'POST' });
  const { cloudName } = signData;

  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${imageId}`;

  await fetcher(imageUrl, { method: 'HEAD' });

  return imageUrl;
}

export async function uploadImage(file: File) {
  const signData = await fetcher<SignData>('/api/sign-cloudinary', { method: 'POST' });
  const { apiKey, timestamp, signature, folder, cloudName } = signData;
  const formData = new FormData();

  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);
  formData.append('image_metadata', 'true');

  const data = await fetcher<{
    error: {
      message: string;
    };
    public_id: string;
    secure_url: string;
    original_filename: string;
    width: number;
    height: number;
    image_metadata: {
      DPI: string;
    };
  }>(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (data.error) {
    throw Error(data.error.message);
  }

  return {
    id: data.public_id,
    url: data.secure_url,
    originalFilename: data.original_filename,
    width: data.width,
    height: data.height,
    dpi: Number(data.image_metadata.DPI),
  };
}

export async function deleteImageByIdClient(imageId: string) {
  const signData = await fetcher<SignData>('/api/sign-cloudinary', { method: 'POST' });
  const { apiKey, timestamp, signature, cloudName } = signData;
  const formData = new FormData();

  formData.append('public_id', imageId);
  formData.append('signature', signature);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());

  const data = await fetcher<{ result: string }>(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (data.result !== 'ok') {
    throw Error('Failed to delete image');
  }

  return data;
}
