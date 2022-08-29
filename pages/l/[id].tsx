import React from 'react';
import { GetStaticProps } from 'next';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import NotFoundPage from '../404';
import Trail from '../../components/TrailOverview';

export async function getStaticPaths() {
  // Defer SSG since links are created by user after deploy
  return {
    paths: [],
    fallback: 'blocking',
  };
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const authorLink = await prisma.link.findUnique({
    where: { id: params?.id?.toString() },
    include: {
      user: true,
    },
  });
  if (!authorLink) {
    return {
      props: {},
      revalidate: 10,
    };
  }
  return {
    props: { linkId: authorLink.id, authorName: authorLink.user.name },
    revalidate: 10,
  };
};

type ShareProps = {
  linkId?: string;
  authorName?: string;
};
const SharePage: React.FC<ShareProps> = (props) => {
  if (!props.linkId) {
    return <NotFoundPage />;
  }
  return (
    <Layout>
      <Trail {...props} />
    </Layout>
  );
};

export default SharePage;
