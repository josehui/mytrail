// pages/drafts.tsx

import React from 'react';
import { useSession } from 'next-auth/react';
import { Center, Title, Text } from '@mantine/core';
import Layout from '../components/Layout';
import Trail from '../components/Trail/TrailOverview';

const MyTrail: React.FC = () => {
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
      <Trail />
    </Layout>
  );
};

export default MyTrail;
