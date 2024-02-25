'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const {data: session} = useSession();

  return session?.user ? (
    <button onClick={() => signOut()}>ログアウト</button>
  ) : (
    <button
      onClick={() =>
        signIn('google', {
          callbackUrl: searchParams.get('callbackUrl') || '/calendar',
        })
      }
    >
      ログイン
    </button>
  );
}
