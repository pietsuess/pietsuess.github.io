// VEIT push service worker
self.addEventListener("push", event => {
  let data = { title: "VEIT", body: "New nudge" };
  try { if (event.data) data = event.data.json(); } catch (e) {
    if (event.data) data = { title: "VEIT", body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "VEIT", {
      body: data.body || "",
      tag: "veit-nudge",
      renotify: true,
      icon: "icon.png",
      badge: "icon.png"
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(clients.openWindow("https://github.com/pietsuess/veit/blob/main/latest-message.md"));
});
