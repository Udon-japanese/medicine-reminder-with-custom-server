export default async function uploadImage(file: File) {
  const signResponse = await fetch('/api/sign-cloudinary', { method: 'POST' });
  const signData = (await signResponse.json()) as {
    apiKey: string;
    timestamp: string;
    signature: string;
    folder: string;
    cloudName: string;
  };

  const formData = new FormData();

  formData.append('file', file);
  formData.append('api_key', signData.apiKey);
  formData.append('timestamp', signData.timestamp);
  formData.append('signature', signData.signature);
  formData.append('folder', signData.folder);
  formData.append('image_metadata', 'true');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );
  const data = (await response.json()) as {
    error: {
      message: string;
    };
    secure_url: string;
    original_filename: string;
    width: number;
    image_metadata: {
      DPI: string;
    };
  };

  if (data.error) {
    throw Error(data.error.message);
  }

  return {
    url: data.secure_url,
    originalFilename: data.original_filename,
    width: data.width,
    dpi: Number(data.image_metadata.DPI),
  };
}

const CLOUDINARY_REGEX =
  /^.+\.cloudinary\.com\/(?:[^\/]+\/)(?:(image|video|raw)\/)?(?:(upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)\/)?(?:(?:[^_/]+_[^,/]+,?)*\/)?(?:v(\d+|\w{1,2})\/)?([^\.^\s]+)(?:\.(.+))?$/;

export function isCloudinaryUrl(url: string) {
  return CLOUDINARY_REGEX.test(url);
}
