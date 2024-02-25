'use client';
import avatarStyles from '@styles/components/avatar.module.scss';
import globalStyles from '@styles/styles.module.scss';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { AccountCircle } from '@mui/icons-material';
import Image from 'next/image';

type Maybe<T> = T | null | undefined;

export default function Avatar({
  src,
  alt,
  isActive = false,
}: {
  src: Maybe<string>;
  alt: Maybe<string>;
  isActive?: boolean;
}) {
  if (!(src && alt)) {
    return (
      <>
        <AccountCircle className={globalStyles.icon} />
        <VisuallyHidden.Root>アカウントのアイコン</VisuallyHidden.Root>
      </>
    );
  }

  return (
    <>
      <div
        className={`${avatarStyles.root} ${
          isActive ? avatarStyles.active : ''
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="50vw"
          className={avatarStyles.image}
        />
      </div>
      <VisuallyHidden.Root>{alt}のアイコン</VisuallyHidden.Root>
    </>
  );
}
