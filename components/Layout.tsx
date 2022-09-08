import React, { ReactNode } from 'react';
import { Box } from '@mantine/core';
import Header from './Header';
import Footer from './Footers';

type Props = {
  children: ReactNode;
};

const links = [
  {
    link: '#',
    label: 'Contact',
  },
  {
    link: '#',
    label: 'Privacy',
  },
  {
    link: '#',
    label: 'Blog',
  },
];
const Layout: React.FC<Props> = (props) => (
  <>
    <Header />
    <Box sx={{ minHeight: '75vh' }} mt={90}>
      {props.children}
    </Box>
    <Footer links={links} />
  </>
);

export default Layout;
