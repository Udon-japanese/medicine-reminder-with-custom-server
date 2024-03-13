'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: session } = useSession();

  return session?.user ? (
    <>
    <button onClick={() => signOut()}>ログアウト</button>
    <Link href="/today">今日のお薬</Link>
    <Link href="/calendar">カレンダー</Link>
    <Link href="/medicines">お薬一覧</Link>
    <Link href="/mypage">マイページ</Link>
    </>
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
