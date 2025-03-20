export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
      .then(reg => console.log("Service Worker ลงทะเบียนแล้ว", reg))
      .catch(err => console.error("Service Worker ลงทะเบียนล้มเหลว", err));
  }
}
