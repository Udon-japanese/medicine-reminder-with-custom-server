'use client';
import { Google } from '@mui/icons-material';
import styles from '@styles/components/login/loginForm.module.scss';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  return (
    <div className={styles.container}>
      <button
        type='button'
        onClick={() => {
          signIn('google');
        }}
        className={styles.loginWithGoogleButton}
      >
        <Google />
        <div>Googleアカウントでログイン</div>
      </button>
    </div>
  );
}
