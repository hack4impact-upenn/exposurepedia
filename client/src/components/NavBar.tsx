import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import MenuListComposition from './MenuList';
import { selectUser } from '../util/redux/userSlice';
import { useAppSelector } from '../util/redux/hooks';
import { useData } from '../util/api';

interface NavTabProps {
  label?: string;
  href?: string;
}

const tabStyle = {
  color: '#397FBF',
  borderRadius: 30,
  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#ffffff',
    backgroundColor: '#397FBF',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
};

function NavTab(props: NavTabProps) {
  return (
    <Tab
      disableRipple
      sx={tabStyle}
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

  const data = useData('auth/authstatus');
  const self = useAppSelector(selectUser);
  const location = useLocation();
  console.log(self);
  console.log(location.pathname);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return !data?.error ? (
    <Box
      sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="nav tabs example"
        TabIndicatorProps={{
          hidden: true,
        }}
      >
        <NavTab label="Home" href="/home" />
        <NavTab label="Exposurepedia" href="/trash" />
        <NavTab label="Submit Resources" href="/spam" />
        <NavTab label="Hierarchies" href="/hierarchies" />
        <NavTab label="Contact" href="/contact" />
      </Tabs>
      <MenuListComposition user={self} />
    </Box>
  ) : (
    <Box
      sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="nav tabs example"
        TabIndicatorProps={{
          hidden: true,
        }}
      >
        <NavTab label="Home" href="/home" />
        <NavTab label="Contact Us" href="/contact" />
      </Tabs>
      {location.pathname !== '/login' && (
        <Button component={Link} to="/login">
          Login
        </Button>
      )}
    </Box>
  );
}
