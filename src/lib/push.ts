import webPush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    "mailto:notifications@radiaeta.app",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

interface PushSubscription {
  endpoint: string;
  expirationTime?: number | null;
  keys?: { p256dh?: string; auth?: string };
}

export async function sendPushToSubscription(
  subscription: PushSubscription,
  payload: { title: string; body: string; url?: string; tag?: string }
): Promise<boolean> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;
  if (!subscription.endpoint) return false;

  try {
    await webPush.sendNotification(
      {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime ?? null,
        keys: subscription.keys as { p256dh: string; auth: string },
      },
      JSON.stringify(payload)
    );
    return true;
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 404 || statusCode === 410) {
      return false;
    }
    console.error("Push notification error:", error);
    return false;
  }
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url?: string; tag?: string }
): Promise<number> {
  const { NotificationPreference } = await import("@/models");
  const prefs = await NotificationPreference.findOne({ userId }).lean();
  if (!prefs?.pushSubscriptions?.length) return 0;

  let sent = 0;
  const staleEndpoints: string[] = [];

  for (const sub of prefs.pushSubscriptions) {
    const success = await sendPushToSubscription(sub as PushSubscription, payload);
    if (success) {
      sent++;
    } else {
      staleEndpoints.push(sub.endpoint);
    }
  }

  if (staleEndpoints.length > 0) {
    await NotificationPreference.findOneAndUpdate(
      { userId },
      { $pull: { pushSubscriptions: { endpoint: { $in: staleEndpoints } } } }
    );
  }

  return sent;
}
