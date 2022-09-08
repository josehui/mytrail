import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Center, Title, Text } from '@mantine/core';
import Layout from '../components/Layout';
import UserSettings from '../components/UserSettings';
import type { settingFormProps } from '../components/UserSettings';
import prisma from '../lib/prisma';

interface settingPageProps {
  settings: settingFormProps;
  auth: boolean;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { settings: null, auth: false } };
  }
  const settings = await prisma.userSettings.findFirst({
    where: {
      user: { email: session?.user?.email },
    },
  });
  return {
    props: { settings, auth: true },
  };
};

const Settings: React.FC<settingPageProps> = (props: settingPageProps) => {
  if (!props.auth) {
    return (
      <Layout>
        <Center>
          <Title order={4}>You are not authenicated</Title>
        </Center>
        <Text align="center">Sign in to view this page. </Text>
      </Layout>
    );
  }
  return (
    <Layout>
      <Text mb={10} align="center">
        Edit your current settings{' '}
      </Text>
      <UserSettings {...props.settings} />
    </Layout>
  );
};

export default Settings;
