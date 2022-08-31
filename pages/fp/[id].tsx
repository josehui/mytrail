import React from 'react';
import { GetStaticProps } from 'next';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import NotFoundPage from '../404';
import FootPrintDetail, { FootPrintDetailProps } from '../../components/Trail/FootPrintDetail';

export async function getStaticPaths() {
  // Defer SSG since links are created by user after deploy
  return {
    paths: [],
    fallback: 'blocking',
  };
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  let footprint = await prisma.footprint.findUnique({
    where: { id: params?.id?.toString() },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  footprint = JSON.parse(JSON.stringify(footprint));
  return {
    props: { footprint },
    revalidate: 10,
  };
};

type FootPrintPageProps = {
  footprint?: FootPrintDetailProps;
};

const FootPrintPage: React.FC<FootPrintPageProps> = (props) => {
  if (!props.footprint) {
    return <NotFoundPage />;
  }
  return (
    <Layout>
      {/* <div>Found! {props.footprint.address} </div> */}
      <FootPrintDetail {...props.footprint} />
    </Layout>
  );
};

export default FootPrintPage;
