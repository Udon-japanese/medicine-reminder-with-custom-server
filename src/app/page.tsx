'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: session } = useSession();

  return session?.user ? (
    <button onClick={() => signOut()}>ログアウト</button>
  ) : (
    <button
      onClick={() =>
        signIn('google', {
          callbackUrl: (searchParams.callbackUrl as string) || '/calendar',
        })
      }
    >
      ログイン
    </button>
  );
}
