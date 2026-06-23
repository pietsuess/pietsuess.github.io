/*
 * VEIT reserve service worker
 * --------------------------------
 * Registered from /veit/ scope. Its only jobs:
 *   1. Exist so the page can create a PushManager subscription (the Push API
 *      requires an active service worker registration).
 *   2. Display the notification VEIT sends when the limited run opens.
 *
 * The actual notifications are sent later, server-side, by send-push.js in the
 * PRIVATE veit repo, signed with the PRIVATE half of the same VAPID keypair
 * whose PUBLIC half lives in index.html (applicationServerKey).
 */

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  var data = { title: 'VEIT', body: 'The limited run is open.', url: '/veit/' };
  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: 'veit-reserve',
      data: { url: data.url || '/veit/' }
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/veit/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(url) !== -1 && 'focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
