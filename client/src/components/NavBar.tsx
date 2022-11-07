import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuListComposition from './MenuList';

interface NavTabProps {
  label?: string;
  href?: string;
}

function NavTab(props: NavTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}

export default function NavBar() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
    >
      <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
        <NavTab label="Home" href="/home" />
        <NavTab label="Exposurepedia" href="/trash" />
        <NavTab label="Submit Resources" href="/spam" />
        <NavTab label="Hierarchies" href="/hierarchies" />
        <NavTab label="Contact" href="/contact" />
      </Tabs>
      <MenuListComposition />
    </Box>
  );
}
