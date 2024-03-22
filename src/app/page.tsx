import Link from 'next/link';
import getCurrentUser from './actions/getCurrentUser';
import LoginButton from './components/Login/LoginButton';
import { Suspense } from 'react';

export default async function Page() {
  const currentUser = await getCurrentUser();
  if (!(currentUser?.id && currentUser.name)) {
    return (
      <Suspense>
        <LoginButton />
      </Suspense>
    );
  }

  return (
    <div>
      <h1>ようこそ、{currentUser.name}さん</h1>
      <Link href='/today'>本日の予定を確認しましょう。</Link>
    </div>
  );
}
