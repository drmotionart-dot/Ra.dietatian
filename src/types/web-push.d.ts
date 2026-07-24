declare module "web-push" {
  interface PushSubscription {
    endpoint: string;
    expirationTime?: number | null;
    keys?: { p256dh: string; auth: string };
  }

  interface NotificationPayload {
    title?: string;
    body?: string;
    icon?: string;
    badge?: string;
    image?: string;
    tag?: string;
    url?: string;
    data?: unknown;
  }

  interface SendResult {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
  }

  function setVapidDetails(
    mailto: string,
    publicKey: string,
    privateKey: string
  ): void;

  function sendNotification(
    subscription: PushSubscription,
    payload: string | Buffer | NotificationPayload
  ): Promise<SendResult>;

  export { setVapidDetails, sendNotification, PushSubscription, NotificationPayload, SendResult };
  export default { setVapidDetails, sendNotification };
}
