import { ChangeEvent, useState, useEffect } from 'react';
import { Title, Text, Switch, Button, Chip, Loader, Group } from '@mantine/core';
import Link from 'next/link';
import { base64ToUint8Array } from '../lib/buffer';

const NotificationSetting = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | undefined | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isTested, setIsTested] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub);
            setIsSubscribed(true);
            console.log({ sub });
          }
        });
        setRegistration(reg);
      });
    }
  }, []);

  const handleSubscription = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const subscribe = event.currentTarget.checked;
    if (subscribe) {
      setIsSubscribing(true);
      const sub = await registration?.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!),
      });
      // TODO: you should call your API to save subscription data on server in order to send web push notification from server
      setSubscription(sub);
      setIsSubscribed(true);
      setIsSubscribing(false);
      console.log('web push subscribed!');
      console.log(sub);
      return;
    }
    if (!subscribe) {
      await subscription?.unsubscribe();
      // TODO: you should call your API to delete or invalidate subscription data on server
      setSubscription(null);
      setIsSubscribed(false);
      console.log('web push unsubscribed!');
    }
  };

  const handleTestNotification = async () => {
    if (!subscription) {
      console.error('web push not subscribed');
      return;
    }
    if (!isTested) {
      console.log({ subscription });
      await fetch('/api/notification-check', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
        }),
      });
      setIsTested(true);
    }
  };

  return (
    <>
      <Title order={6}>
        Not yet available for IOS, waiting for{' '}
        <Link href="https://www.apple.com/vn/ios/ios-16-preview/features/" passHref>
          <Text variant="link" component="a">
            Apple
          </Text>
        </Link>
      </Title>
      <Group>
        <Switch
          mt="md"
          checked={isSubscribed}
          onChange={handleSubscription}
          label="Subscribe to notification"
        />
        {isSubscribing && <Loader mt={17} size={20} />}
      </Group>
      <Group>
        <Chip checked={isTested} onChange={handleTestNotification} mt="md">
          Test notification
        </Chip>
        {isTesting && <Loader mt={17} size={20} />}
      </Group>
    </>
  );
};

export default NotificationSetting;
