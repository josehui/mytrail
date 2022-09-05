// eslint-disable-next-line react/no-typos
import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

declare global {
  interface Window {
    workbox: any;
  }
  interface PushSubscription {
    expirationTime: DOMHighResTimeStamp;
  }
  interface Error {
    status?: number;
    code?: number;
    info?: string;
  }
}
