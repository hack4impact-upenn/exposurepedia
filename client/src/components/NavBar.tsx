import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
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
  color: 'black',
  borderRadius: 30,
  minHeight: '0px',
  textTransform: 'none',
  fontSize: '16px',
  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#397FBF',
    height: '10px',
    margin: 'auto',
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
      component={Link}
      // eslint-disable-next-line react/destructuring-assignment
      to={`${props.href}`}
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

  React.useEffect(() => {
    if (location.pathname === '/home' || location.pathname === '/login') {
      setValue(0);
    } else if (
      location.pathname === '/exposurepedia' ||
      (location.pathname === '/contact' && data?.error)
    ) {
      setValue(1);
    } else if (location.pathname === '/submitresources') {
      setValue(2);
    } else if (location.pathname === '/hierarchies') {
      setValue(3);
    } else if (location.pathname === '/contact') {
      setValue(4);
    }
  }, [data?.error, location.pathname]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return !data?.error ? (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#ffffff',
        zIndex: (theme: { zIndex: { drawer: number } }) =>
          theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
        }}
        disableGutters
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
          <NavTab label="Exposurepedia" href="/exposurepedia" />
          <NavTab label="Submit Resources" href="/submitresources" />
          <NavTab label="Hierarchies" href="/hierarchies" />
          <NavTab label="Modifications" href="/modifications" />
          <NavTab label="Contact" href="/contact" />
        </Tabs>
        <MenuListComposition user={self} />
      </Toolbar>
    </AppBar>
  ) : (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0px',
        boxShadow: '2px 2px 2px rgba(0,0,0,0.3)',
        padding: '5px 2px',
        zIndex: 10,
      }}
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
        <Button
          sx={{ textTransform: 'none', fontSize: '16px' }}
          component={Link}
          to="/login"
        >
          Login
        </Button>
      )}
    </Box>
  );
}
