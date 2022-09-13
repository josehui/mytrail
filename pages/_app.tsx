/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/self-closing-comp */
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import type { AppProps } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider, Global } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { SessionProvider } from 'next-auth/react';

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        body: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.white,
        },
      })}
    />
  );
}
export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>MyTrail</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="application-name" content="MyTrail" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MyTrail" />
        <meta name="description" content="Travel trail tracker for everyone" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192x192.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icon-192x192.png" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="twitter:url" content="https://mytrail.live" />
        <meta name="twitter:title" content="MyTrail" />
        <meta name="twitter:description" content="Best MyTrail in the world" />
        <meta name="twitter:image" content="https://mytrail.live/icon-192x192.png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MyTrail" />
        <meta property="og:description" content="Travel trail tracker for everyone" />
        <meta property="og:site_name" content="MyTrail" />
        <meta property="og:url" content="https://mytrail.live" />
        <meta property="og:image" content="https://mytrail.live/icon-192x192.png" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <GlobalStyles />
          <NotificationsProvider>
            <SessionProvider session={pageProps?.session}>
              <Component {...pageProps} />
            </SessionProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
});
