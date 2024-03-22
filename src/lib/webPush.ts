import webPush from 'web-push';
import dotenv from 'dotenv';
dotenv.config();

webPush.setVapidDetails(
  'mailto:hoge@hoge.hoge',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC!,
  process.env.VAPID_PRIVATE!,
);

export { webPush };
