import { ChangeEvent, useState, useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import { Title, Text, Switch, Chip, Loader, Group } from '@mantine/core';
import Link from 'next/link';
import { base64ToUint8Array } from '../lib/buffer';

const NotificationSetting = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | undefined | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isTested, setIsTested] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDeviceSupported, setIsDeviceSupported] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      window.workbox !== undefined
    ) {
      console.log('supported');
      setIsDeviceSupported(true);
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
        setRegistration(reg);
      });
    } else {
      console.log('not supported');
      setIsDeviceSupported(false);
    }
  }, []);

  const handleSubscription = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const subscribe = event.currentTarget.checked;
    // Subscribe to notification
    if (subscribe) {
      setIsSubscribing(true);
      try {
        const sub = await registration?.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!),
        });
        // TODO: you should call your API to save subscription data on server in order to send web push notification from server
        await fetch('/api/notification', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            subscription: sub,
          }),
        });
        showNotification({
          id: 'subscribe-success',
          autoClose: 5000,
          title: 'Subscribed',
          message: 'You will receive reminder notifications',
          color: 'green',
          loading: false,
        });
        setSubscription(sub);
        setIsSubscribed(true);
        console.log('web push subscribed!');
      } catch (error) {
        showNotification({
          id: 'subscribe-error',
          autoClose: 5000,
          title: 'Cannot create subscription',
          message: 'Please check permission for Notifications',
          color: 'red',
          loading: false,
        });
        console.error(error);
      }
      setIsSubscribing(false);
      return;
    }
    // Unsubscribe
    if (!subscribe) {
      await fetch('/api/notification', {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
        }),
      });
      await subscription?.unsubscribe();
      setSubscription(null);
      setIsSubscribed(false);
      showNotification({
        id: 'unsubscribe-success',
        autoClose: 5000,
        title: 'Unsubscribed',
        message: 'You will no longer receive notifications',
        color: 'blue',
        loading: false,
      });
    }
  };

  const handleTestNotification = async () => {
    if (!subscription) {
      showNotification({
        id: 'test-fail',
        autoClose: 5000,
        title: 'Failed to test notification',
        message: 'You are not subscribed to notifications',
        color: 'red',
        loading: false,
      });
      return;
    }
    if (!isTested) {
      console.log({ subscription });
      setIsTesting(true);
      await fetch('/api/cron/reminder', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
        }),
      });
      setIsTested(true);
      setIsTesting(false);
    }
  };

  return (
    <>
      {!isDeviceSupported && (
        <>
          <Title order={6}>Browser/ Device not supported</Title>
          <Title order={6} mb="md">
            For IOS, wait till 2023 according to{' '}
            <Link href="https://www.apple.com/vn/ios/ios-16-preview/features/" passHref>
              <Text variant="link" component="a">
                Apple
              </Text>
            </Link>
          </Title>
        </>
      )}
      <Group>
        <Switch
          checked={isSubscribed}
          onChange={handleSubscription}
          label="Subscribe to notifications"
          disabled={!isDeviceSupported}
        />
        {isSubscribing && <Loader mt={17} size={20} />}
      </Group>
      <Group>
        <Chip
          checked={isTested}
          onChange={handleTestNotification}
          mt="md"
          disabled={!isDeviceSupported}
        >
          Test notification
        </Chip>
        {isTesting && <Loader mt={17} size={20} />}
      </Group>
    </>
  );
};

export default NotificationSetting;
