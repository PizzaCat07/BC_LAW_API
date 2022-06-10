import React from 'react';
import {Drawer, DrawerItem, IndexPath} from '@ui-kitten/components';

export const Drawer = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));

  return (
    <Drawer
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}>
      <DrawerItem title="Parts" />
      <DrawerItem title="Divisions" />
    </Drawer>
  );
};
