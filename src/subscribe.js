export async function subscribeUser() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    const registration = await navigator.serviceWorker.ready;

    // ขออนุญาตส่ง Notification
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return alert("กรุณาอนุญาตให้แจ้งเตือน!");

    // สมัครรับ Subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: "BIu9AYB0hqFRl3gukuam_8WKlvEXaLO9EyEoReaaHn7eu_Ttyqmg6nYh0SkcIqTNMbJXwm__mWm9qAmglYjLKMU" // ใช้ Public Key ที่สร้างไว้
    });

    console.log("Subscription:", JSON.stringify(subscription));

    // ส่งไปให้เซิร์ฟเวอร์
    await fetch("http://localhost:3000/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" }
    });
  }
}
