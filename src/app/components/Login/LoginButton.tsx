'use client';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import styles from '@styles/components/login/loginButton.module.scss';

export default function LoginButton() {
  const searchParams = useSearchParams();
  return (
    <button
      type='button'
      className={styles.button}
      onClick={() =>
        signIn('google', {
          callbackUrl: searchParams.get('callbackUrl') || '/today',
        })
      }
    >
      ログイン
    </button>
  );
}
