import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
  secure: true,
});

type Maybe<T> = T | null | undefined;
export async function getImageUrlByIdServer(
  imageId: Maybe<string>,
): Promise<string | null> {
  if (!imageId || typeof imageId !== 'string') return null;
  const image = await cloudinary.api.resource(imageId);
  return image.secure_url;
}

export async function deleteImageByIdServer(imageId: Maybe<string>) {
  if (!imageId) return;
  await cloudinary.uploader.destroy(imageId);
}

export default cloudinary;
