'use client';
import { Google } from '@mui/icons-material';
import styles from '@styles/components/login/loginForm.module.scss';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();

  return (
    <div className={styles.container}>
      <button
        type='button'
        onClick={() =>
          signIn('google', {
            callbackUrl: searchParams.get('callbackUrl') || '/medicines',
          })
        }
        className={styles.loginWithGoogleButton}
      >
        <Google />
        <div>Googleアカウントでログイン</div>
      </button>
    </div>
  );
}
