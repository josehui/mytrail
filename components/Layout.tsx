import React, { ReactNode } from 'react';
import { Box } from '@mantine/core';
import Header from './Header';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <>
    <Header />
    <Box className="layout" mt={90}>
      {props.children}
    </Box>
  </>
);

export default Layout;
