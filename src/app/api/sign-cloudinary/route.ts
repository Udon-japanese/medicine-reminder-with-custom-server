import getCurrentUser from '@/app/actions/getCurrentUser';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
  secure: true,
});

const cloudName = cloudinary.config().cloud_name!;
const apiSecret = cloudinary.config().api_secret!;
const apiKey = cloudinary.config().api_key!;
const folder = 'medicine-reminder';

export async function POST() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      image_metadata: true,
    },
    apiSecret,
  );

  return Response.json({ timestamp, folder, signature, apiKey, cloudName });
}
