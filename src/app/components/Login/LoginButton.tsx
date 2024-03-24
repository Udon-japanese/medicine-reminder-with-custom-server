'use client';
import styles from '@styles/components/login/loginButton.module.scss';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function LoginButton() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <>
      <button
        type='button'
        className={styles.button}
        onClick={() => setShowLoginModal(true)}
      >
        ログイン
      </button>
      <LoginModal showModal={showLoginModal} setShowModal={setShowLoginModal} />
    </>
  );
}
