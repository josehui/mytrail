import webPush from 'web-push';

const wpClient = webPush;
wpClient.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
  process.env.WEB_PUSH_PRIVATE_KEY!
);

const createReminderTask = async (subscription: PushSubscription) => {
  try {}
};
export default wpClient;
