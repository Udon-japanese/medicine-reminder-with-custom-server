import Modal from '@/app/components/Modal';
import styles from '@/styles/components/settings/account/deleteAccountModal.module.scss';
import { WarningAmberRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

export default function DeleteAccountModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className={styles.container}>
        <div className={styles.warningIconWrapper}>
          <WarningAmberRounded fontSize='inherit' />
        </div>
        <div className={styles.header}>アカウントを削除しますか？</div>
        <div className={styles.description}>
          アカウントを削除すると、これまでの服薬記録や登録されたお薬などがすべて削除され、元に戻すことはできません。続行してもよろしいですか？
        </div>
        <div className={styles.buttonsContainer}>
          <button
            type='button'
            onClick={() => setShowModal(false)}
            className={styles.cancelButton}
          >
            キャンセル
          </button>
          <button
            type='button'
            onClick={() => router.push('/settings/account/delete')}
            className={styles.deleteAccountButton}
          >
            続行する
          </button>
        </div>
      </div>
    </Modal>
  );
}
