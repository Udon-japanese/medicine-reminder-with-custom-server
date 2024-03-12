export const isInvalidPushSubscription = (subscription: any) => {
  if (
    subscription == null ||
    !subscription.endpoint ||
    typeof subscription.endpoint !== 'string' ||
    subscription.keys == null ||
    !subscription.keys.auth ||
    typeof subscription.keys.auth !== 'string' ||
    !subscription.keys.p256dh ||
    typeof subscription.keys.p256dh !== 'string'
  ) {
    return true;
  }
  try {
    new URL(subscription.endpoint);
  } catch (_) {
    return true;
  }
  return false;
};
