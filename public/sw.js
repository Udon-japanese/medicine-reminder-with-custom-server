self.addEventListener('push', (e) => {
  if (!self.Notification || self.Notification.permission !== 'granted') return;

  if (e.data) {
    const data = JSON.parse(e.data.text());

    if (!data.body) return;

    const APP_ICON = '/medicine-reminder.png';

    const options = {
      body: data.body,
      image: data.image || APP_ICON,
      icon: data.image || APP_ICON,
    };

    e.waitUntil(self.registration.showNotification('お薬リマインダー', options));
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow('/today');
    }),
  );
});

// self.addEventListener("fetch", function (event) {});
