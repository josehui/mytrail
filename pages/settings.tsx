import React from 'react';
import { useSession } from 'next-auth/react';
import { Center, Title, Text } from '@mantine/core';
import Layout from '../components/Layout';
import UserSettings from '../components/UserSettings';

const Settings: React.FC = () => {
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
  return (
    <Layout>
      <Text mb={10} align="center">
        Edit your current settings{' '}
      </Text>
      <UserSettings />
    </Layout>
  );
};

export default Settings;
