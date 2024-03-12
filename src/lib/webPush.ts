import webPush from 'web-push';

webPush.setVapidDetails(
  'mailto:hoge@hoge.hoge',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC!,
  process.env.VAPID_PRIVATE!,
);

export { webPush };
