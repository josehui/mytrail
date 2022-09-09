import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import { getProviders, signIn, getCsrfToken, useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import AuthenticationForm from '../../components/AuthenticationForm';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(ctx);
  return {
    props: { providers, csrfToken },
  };
}

// @ts-ignore
const signInPage = ({ csrfToken, providers }) => {
  const { data: session, status } = useSession();
  if (session) {
    Router.push('/mytrail');
    return <></>;
  }
  if (!session && status !== 'loading') {
    return (
      <Layout>
        <AuthenticationForm {...{ csrfToken, providers, signIn }} />
      </Layout>
    );
  }
  return <></>;
};

export default signInPage;
