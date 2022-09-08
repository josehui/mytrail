import React, { ReactNode } from 'react';
import { Drawer } from '@mantine/core';

interface drawerProps {
  children: ReactNode;
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const TrailDrawer: React.FC<drawerProps> = (props) => {
  const { openDrawer, setOpenDrawer, children } = props;

  return (
    <>
      <Drawer
        opened={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title="Footprints"
        padding="xl"
        size="85%"
        lockScroll={false}
        position="bottom"
        styles={{ drawer: { overflowY: 'scroll', borderRadius: 5 } }}
      >
        {children}
      </Drawer>
    </>
  );
};

export default TrailDrawer;
