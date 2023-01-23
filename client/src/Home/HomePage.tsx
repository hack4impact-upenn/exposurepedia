import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { Typography, Grid, Toolbar, Tooltip } from '@mui/material';
import home from './home.jpeg';
import { useAppDispatch, useAppSelector } from '../util/redux/hooks';
import {
  logout as logoutAction,
  toggleAdmin,
  selectUser,
} from '../util/redux/userSlice';
import { logout as logoutApi, selfUpgrade } from './api';
import ScreenGrid from '../components/ScreenGrid';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { useData } from '../util/api';

interface PromoteButtonProps {
  admin: boolean | null;
  handleSelfPromote: () => void;
  navigator: NavigateFunction;
}

/**
 * A button which, when clicked, will promote the user to admin. If the user is already admin, the button will be a link to the admin dashboard.
 * @param admin - a boolean indicating whether the user is an admin
 * @param handleSelfPromote - a function which promotes the user to admin
 * @param navigator - a function which navigates to a new page (passed in from parent function)
 */
function PromoteButton({
  admin,
  handleSelfPromote,
  navigator,
}: PromoteButtonProps) {
  if (admin === null) {
    return null;
  }
  return !admin ? (
    <PrimaryButton variant="contained" onClick={handleSelfPromote}>
      Promote self to admin
    </PrimaryButton>
  ) : (
    <PrimaryButton
      variant="contained"
      onClick={() => navigator('/users', { replace: true })}
    >
      View all users
    </PrimaryButton>
  );
}

const styles = {
  img: {
    width: '100vw',
    height: '60vh',
    'object-fit': 'cover',
    opacity: '0.4',
    position: 'relative' as 'absolute',
    'z-index': '-2',
  },
  imgOverlay: {
    position: 'absolute' as const,
    top: '70px',
    width: '100%',
    height: '60vh',
    // 'z-index': '-1',
  },
  container: {
    margin: 'auto',
    'text-align': 'center',
    width: '50%',
    'font-size': '28px',
    color: 'black',
    // height: '60vh',
    display: 'flex',
    'justify-content': 'center',
    'flex-direction': 'column',
    'z-index': '1',
  },
  paragraph: {
    width: '50%',
    margin: '20px auto 30px auto',
    'font-size': '16px',
    color: '#2b2b2b',
  },
};

/**
 * The HomePage of the user dashboard. Displays a welcome message, a logout button and a button to promote the user to admin if they are not already an admin. If the user is an admin, the button will navigate them to the admin dashboard. This utilizes redux to access the current user's information.
 */
function HomePage() {
  const user = useAppSelector(selectUser);
  const data = useData('auth/authstatus');
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const [admin, setAdmin] = useState(user.admin);
  const logoutDispatch = () => dispatch(logoutAction());
  const handleLogout = async () => {
    if (await logoutApi()) {
      logoutDispatch();
      navigator('/login', { replace: true });
    }
  };

  const handleSelfPromote = async () => {
    const newAdminStatus = await selfUpgrade(user.email as string);
    if (newAdminStatus) {
      dispatch(toggleAdmin());
      setAdmin(true);
    }
  };

  return (
    <div>
      <img style={styles.img} alt="exposure therapy" src={home} />
      <div style={styles.imgOverlay}>
        <div style={styles.container}>
          <h1>Welcome to Exposurepedia</h1>
          {!data?.error ? (
            <Button
              component={Link}
              to="/exposurepedia"
              variant="contained"
              sx={{
                textTransform: 'none',
                width: '250px',
                margin: '0px auto',
                background: '#00538E',
                zIndex: '3',
              }}
            >
              Go to Exposurepedia
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  textTransform: 'none',
                  width: '180px',
                  margin: '7px auto',
                  background: '#00538E',
                  zIndex: '3',
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  textTransform: 'none',
                  width: '180px',
                  margin: '7px auto',
                  background: '#00538E',
                  zIndex: '3',
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
      <p style={styles.paragraph}>
        This website is meant to serve as a repository of resources for
        therapists conducting exposure therapy. If you are an exposure
        therapist, please check out The Exposurepedia! You will find thousands
        of ideas, videos, audio, and text to help conduct in-vivo exposures with
        individuals across the anxiety spectrum, including OCD, GAD, Social
        Anxiety, PTSD, and more. <br />
        <br /> If you have resources you would like to share with the therapy
        community, please submit them on the submission page! Sharing your
        experience with others will help everyone provide more effective
        therapy. Submissions are regularly reviewed and added, so The
        Exposurepedia is always growing. <br />
        <br /> For general ideas on modifying the difficulty of exposures, check
        out the modifications page. If you are looking for more general
        resources to learn more about conducting exposure therapy, the
        (non-exhaustive) other resources page might help.
      </p>
    </div>
  );
}

export default HomePage;
