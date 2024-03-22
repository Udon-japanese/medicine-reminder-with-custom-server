export const isInvalidPushSubscription = (subscription: unknown) => {
  if (
    typeof subscription !== 'object' ||
    !subscription ||
    !('endpoint' in subscription) ||
    typeof subscription['endpoint'] !== 'string' ||
    !('keys' in subscription) ||
    typeof subscription['keys'] !== 'object' ||
    subscription['keys'] == null ||
    !('auth' in subscription['keys']) ||
    typeof subscription['keys']['auth'] !== 'string' ||
    !('p256dh' in subscription['keys']) ||
    typeof subscription['keys']['p256dh'] !== 'string'
  ) {
    return true;
  }
  try {
    new URL(subscription['endpoint']);
  } catch (_) {
    return true;
  }
  return false;
};