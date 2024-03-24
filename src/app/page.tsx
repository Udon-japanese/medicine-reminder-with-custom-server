import getCurrentUser from './actions/getCurrentUser';
import LoginButton from './components/Login/LoginButton';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

export default async function Page() {
  const currentUser = await getCurrentUser();
  if (!(currentUser?.id && currentUser.name)) {
    return (
      <Suspense>
        <LoginButton />
      </Suspense>
    );
  }

  redirect('/today');
}
