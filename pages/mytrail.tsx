// pages/drafts.tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import { Center, Title, Text } from '@mantine/core';
import Layout from '../components/Layout';
import Trail from '../components/Trail/TrailOverview';
import { settingFormProps } from '../components/UserSettings';
import prisma from '../lib/prisma';
import { settingsContext } from '../components/Context/Context';

interface MyTrailPageProps {
  userSettings: settingFormProps;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { userSettings: [] } };
  }
  const userSettings = await prisma.userSettings.findFirst({
    where: {
      user: { email: session?.user?.email },
    },
  });
  return {
    props: { userSettings },
  };
};

const MyTrail: React.FC<MyTrailPageProps> = (props: MyTrailPageProps) => {
  const { userSettings } = props;
  const { data: session, status } = useSession();
  if (!session && status !== 'loading') {
    return (
      <Layout>
        <Center>
          <Title order={4}>You are not authenicated</Title>
        </Center>
        <Text align="center">Sign in to view this page. </Text>
      </Layout>
    );
  }
  if (session) {
    return (
      <settingsContext.Provider value={userSettings}>
        <Layout>
          <Trail />
        </Layout>
      </settingsContext.Provider>
    );
  }
  return <></>;
};

export default MyTrail;
