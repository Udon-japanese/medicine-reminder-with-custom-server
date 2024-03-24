'use client';
import { signOut } from 'next-auth/react';
import styles from '@styles/components/settings/index.module.scss';
import accountStyles from '@styles/components/settings/account/index.module.scss';
import { useRouter } from 'next/navigation';
import { ArrowBack } from '@mui/icons-material';
import { useState } from 'react';
import DeleteAccountModal from './DeleteAccountModal';
import Header from '@/app/components/Header';

export default function Page() {
  const router = useRouter();
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <Header headerText='アカウント' action={router.back} actionIcon={<ArrowBack />} />
        <div className={styles.settingList}>
          <button
            className={styles.settingItem}
            onClick={() => signOut({ callbackUrl: '/' })}
            type='button'
          >
            ログアウト
          </button>
          <div className={accountStyles.deleteAccountButtonContainer}>
            <button
              type='button'
              onClick={() => setShowDeleteAccountModal(true)}
              className={accountStyles.deleteAccountButton}
            >
              アカウントを削除する
            </button>
          </div>
        </div>
      </div>
      <DeleteAccountModal
        showModal={showDeleteAccountModal}
        setShowModal={setShowDeleteAccountModal}
      />
    </>
  );
}
