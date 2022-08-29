import React, { ReactNode } from 'react';
import { Box } from '@mantine/core';
import Header from './Header';
import Header2 from './Header2';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <>
    {/* <Header /> */}
    <Header2 />
    <Box className="layout" mt={90}>
      {props.children}
    </Box>
  </>
);

export default Layout;
