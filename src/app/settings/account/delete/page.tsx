'use client';
import Header from '@/app/components/Header';
import { ArrowBack, Done, WarningAmberRounded } from '@mui/icons-material';
import styles from '@styles/components/settings/account/delete/index.module.scss';
import { useRouter } from 'next/navigation';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useState } from 'react';
import { fetcher } from '@/utils';
import { showToast } from '@/lib/toast';
import LinerProgress from '@/app/components/LinerProgress';

export default function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteAgreed, setDeleteAgreed] = useState(false);
  const [deleteSucceeded, setDeleteSucceeded] = useState(false);

  const handleDeleteAccount = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await fetcher('/api/users', {
        method: 'DELETE',
      });
      setDeleteSucceeded(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err)
      showToast(
        'error',
        'アカウントの削除に失敗しました。時間をおいて再度お試してください',
      );
      setIsSubmitting(false);
    }
  };

  if (deleteSucceeded) {
    return (
      <div className={styles.succeedContainer}>
        <div className={styles.succeedIconWrapper}>
          <Done fontSize='inherit' />
        </div>
        <div className={styles.succeedHeader}>アカウント削除が完了しました。</div>
        <div className={styles.succeedDescription}>
          ご利用いただきありがとうございました。再びアプリを利用する場合は、以下のボタンから新しいアカウントを作成してください。
        </div>
        <button
          type='button'
          className={styles.createAccountButton}
          onClick={() => router.push('/login')}
        >
          アカウントを作成する
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <LinerProgress show={isSubmitting} className={styles.desktopLinerProgress} />
      <Header
        headerText='アカウント削除'
        action={router.back}
        showMobileLinerProgress={isSubmitting}
        actionIcon={<ArrowBack />}
      />
      <div className={styles.warningContainer}>
        <div className={styles.warningIconWrapper}>
          <WarningAmberRounded fontSize='inherit' />
        </div>
        <div className={styles.header}>アカウントを削除しますか？</div>
        <div className={styles.description}>
          アカウントを削除すると、これまでの服薬記録や登録されたお薬などがすべて削除され、元に戻すことはできません。続行してもよろしいですか？
        </div>
      </div>
      <div className={styles.agreeAndDeleteButtonContainer}>
        <div className={styles.agreeContainer}>
          <Checkbox.Root
            className={`${styles.agreeCheckbox} ${deleteAgreed ? styles.agreeCheckboxChecked : ''}`}
            defaultChecked={deleteAgreed}
            onCheckedChange={(newVal) => {
              setDeleteAgreed(newVal as boolean);
            }}
            id='agree-delete-account'
          >
            <Checkbox.Indicator>
              <Done fontSize='inherit' />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor='agree-delete-account'>
            服薬記録や登録されたお薬などが削除されることを理解した上で、アカウントを削除することに同意します。
          </label>
        </div>
        <button
          type='button'
          disabled={!deleteAgreed || isSubmitting}
          onClick={handleDeleteAccount}
          className={styles.deleteAccountButton}
        >
          アカウントを削除する
        </button>
      </div>
    </div>
  );
}
