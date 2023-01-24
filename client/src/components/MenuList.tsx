import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { ArrowDropDown } from '@material-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { UserState, logout as logoutAction } from '../util/redux/userSlice';
import { useAppDispatch } from '../util/redux/hooks';
import { logout as logoutApi } from '../Home/api';

interface MenuListProps {
  user: UserState;
}

export default function MenuListComposition({ user }: MenuListProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const logoutDispatch = () => dispatch(logoutAction());
  const handleLogout = async (
    event: Event | React.SyntheticEvent<Element, Event>,
  ) => {
    if (await logoutApi()) {
      logoutDispatch();
      window.location.reload();
      navigator('/login', { replace: true });
      handleClose(event);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          sx={{ textTransform: 'none', padding: '10px 5px' }}
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              fontSize: '16px',
            }}
          >
            {user.firstName} {user.lastName}
            <ArrowDropDown />
          </div>
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    // eslint-disable-next-line react/jsx-no-bind
                    onKeyDown={handleListKeyDown}
                  >
                    {user.admin && (
                      <div>
                        <MenuItem
                          onClick={handleClose}
                          component={Link}
                          to="/users"
                        >
                          Admin Dashboard
                        </MenuItem>
                        <MenuItem
                          onClick={handleClose}
                          component={Link}
                          to="/approve"
                        >
                          Approve Resources
                        </MenuItem>
                        {/* <MenuItem
                          onClick={handleClose}
                          component={Link}
                          to="/broken"
                        >
                          Fix Broken Links
                        </MenuItem> */}
                      </div>
                    )}
                    <MenuItem
                      onClick={(event) => handleLogout(event)}
                      component={Link}
                      to="/"
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}
