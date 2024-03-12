'use client';
import * as Switch from '@radix-ui/react-switch';
import { fetcher } from '@/utils';
import { useEffect, useState } from 'react';
import toggleButtonStyles from '@styles/components/toggleButton.module.scss';
import { showToast } from '@/lib/toast';
import { PushSubscription } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function UserSettingForm({
  pushSubscriptions,
}: {
  pushSubscriptions: PushSubscription[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const registerSubscription = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const permission = await Notification.requestPermission();
      if (permission === 'granted' && process.env.NEXT_PUBLIC_VAPID_PUBLIC != null) {
        const urlB64ToUint8Array = (base64String: string) => {
          const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
          const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);

          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
        };

        if ('serviceWorker' in navigator) {
          const options = {
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC,
            ),
          };

          const registration = await navigator.serviceWorker.ready;
          const pushSubscription = await registration.pushManager.subscribe(options);
          await fetcher('/api/pushSubscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(pushSubscription),
          });
        }
      }
    } catch (err) {
      console.error(err);
      showToast('error', '通知の登録に失敗しました。時間を空けて再度お試しください');
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  const unregisterSubscription = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration != null) {
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            await fetcher('/api/pushSubscription', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(subscription),
            });
            await subscription.unsubscribe();
            showToast('success', '通知の登録を解除しました');
          }
        }
      }
    } catch (err) {
      console.error(err);
      showToast('error', '通知の登録解除に失敗しました。時間を空けて再度お試しください');
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register('./svc_worker.js');
      } catch (err) {
        console.log(`Service Worker registration failed: ${err}`);
      }
      (async () => {
        if ('serviceWorker' in navigator) {
          const swReg = await navigator.serviceWorker.getRegistration();
          if (swReg) {
            const subscription = await swReg.pushManager.getSubscription();
            setRegistered(!!subscription);

            if (!!subscription) {
              const serverHasEndpoint = pushSubscriptions.some(
                (s) => s.endpoint === subscription.endpoint,
              );
              if (!serverHasEndpoint) {
                await subscription.unsubscribe();
                setRegistered(false);
              }
            }
          }
        }
      })();
    }
  }, [pushSubscriptions]);

  return (
    <div>
      <label htmlFor='notify'>通知</label>
      <Switch.Root
        id='notify'
        checked={registered}
        disabled={isSubmitting}
        onCheckedChange={async (newValue) => {
          if (isSubmitting) return;
          setRegistered(newValue);
          if (newValue) {
            await registerSubscription();
          } else {
            await unregisterSubscription();
          }
        }}
        className={toggleButtonStyles.root}
      >
        <Switch.Thumb className={toggleButtonStyles.thumb} />
      </Switch.Root>
    </div>
  );
}
