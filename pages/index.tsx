// import { Welcome } from '../components/Welcome/Welcome';
// import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

// export default function HomePage() {
//   return (
//     <>
//       <Welcome />
//       <ColorSchemeToggle />
//     </>
//   );
// }

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/Hero';
import FeatureSection from '../components/Feature';

const Home: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null | undefined>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const base64ToUint8Array = (base64: any) => {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(b64);
    const outputArray = new Uint8Array(rawData.length);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
  const subscribeButtonOnClick = async (event: any) => {
    // event.preventDefault();
    const sub = await registration?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY),
    });
    // TODO: you should call your API to save subscription data on server in order to send web push notification from server
    setSubscription(sub);
    setIsSubscribed(true);
    console.log('web push subscribed!');
    console.log(sub);
  };

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window?.workbox !== undefined
    ) {
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
    }
  }, []);

  useEffect(() => {
    if (registration) {
      subscribeButtonOnClick('hihi');
    }
  }, [registration]);
  return (
    <Layout>
      <HeroSection />
      <FeatureSection />
    </Layout>
  );
};

export default Home;
