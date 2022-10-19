/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { Dialog } from '@mui/material';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import DeleteUserButton from './DeleteUserButton';
import ApproveUserButton from './ApproveUserButton';
import PromoteUserButton from './PromoteUserButton';
import PopupDialog from './PopupDialog';
import { useData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import IUser from '../util/types/user';
import ButtonFooter from './ButtonFooter';

interface AdminDashboardRow {
  key: string;
  first: string;
  last: string;
  email: string;
  date: string;
  status: string;
  view: React.ReactElement;
}

/**
 * The standalone table component for holding information about the users in
 * the database and allowing admins to remove users and promote users to admins.
 */
function UserTable() {
  // define columns for the table
  const columns: TColumn[] = [
    { id: 'first', label: 'First Name' },
    { id: 'last', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'date', label: 'Date Registered' },
    { id: 'status', label: 'Status' },
    { id: 'view', label: 'View User' },
  ];

  // Used to create the data type to create a row in the table
  function createAdminDashboardRow(
    user: IUser,
    view: React.ReactElement,
  ): AdminDashboardRow {
    const { _id, firstName, lastName, email, date, admin, status } = user;
    let outStatus = status || 'n/a';
    if (admin) {
      outStatus = 'admin';
    }
    const outDate = date || 'no date';
    return {
      key: _id,
      first: firstName,
      last: lastName,
      email,
      date: outDate,
      status: outStatus,
      view,
    };
  }

  const BootstrapDialog = styled(Dialog)(() => ({
    // '& .MuiDialogContent-root': {
    //   padding: theme.spacing(2),
    // },
    // '& .MuiDialogActions-root': {
    //   padding: theme.spacing(1),
    // },
  }));

  const [userList, setUserList] = useState<IUser[]>([]);
  const users = useData('admin/all');
  const self = useAppSelector(selectUser);
  const [openUser, setOpenUser] = useState(-1);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (userId: number) => {
    setOpenUser(userId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Upon getting the list of users for the database, set the state of the userList to contain all users except for logged in user
  useEffect(() => {
    setUserList(
      users?.data.filter(
        (entry: IUser) => entry && entry.email && entry.email !== self.email,
      ),
    );
  }, [users, self]);

  // update state of userlist to remove a user from the frontend representation of the data
  const removeUser = (email: string) => {
    setUserList(
      userList.filter(
        (entry: IUser) => entry && entry.email && entry.email !== email,
      ),
    );
  };
  // update state of userlist to promote a user on the frontend representation
  const updateAdmin = (email: string) => {
    setUserList(
      userList.map((entry) => {
        if (entry.email !== email) {
          return entry;
        }
        const newEntry = entry;
        newEntry.admin = true;
        return newEntry;
      }),
    );
  };
  // update state of userlist to approve a user on the frontend representation
  const acceptUser = (email: string) => {
    setUserList(
      userList.map((entry) => {
        if (entry.email !== email) {
          return entry;
        }
        const newEntry = entry;
        newEntry.status = 'approved';
        return newEntry;
      }),
    );
  };

  // if the userlist is not yet populated, display a loading spinner
  if (!userList) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }
  return (
    <PaginationTable
      rows={userList.map((user: IUser) =>
        createAdminDashboardRow(
          user,
          <>
            <Button
              variant="outlined"
              // eslint-disable-next-line no-underscore-dangle
              onClick={() => handleClickOpen(parseInt(user._id, 10))}
            >
              Open
            </Button>
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              // eslint-disable-next-line no-underscore-dangle
              open={open && openUser === parseInt(user._id, 10)}
            >
              <>
                <PopupDialog id="customized-dialog-title" onClose={handleClose}>
                  Taran Anantasagar
                </PopupDialog>
                <DialogContent dividers>
                  <Typography gutterBottom>
                    <span>
                      <b>Licensed Provider: </b>
                    </span>{' '}
                    Yes
                  </Typography>
                  <Typography gutterBottom>
                    <span>
                      <b>Profession: </b>
                    </span>{' '}
                    School Counselor
                  </Typography>
                  <Typography gutterBottom>
                    <span>
                      <b>Setting(s) worked in: </b>
                    </span>{' '}
                    Private practice, Veterans Affair, Other (Hack4Immpact)
                  </Typography>
                  <Typography gutterBottom>
                    <span>
                      <b>Exposure Therapy Use: </b>
                    </span>{' '}
                    84%
                  </Typography>
                  <Typography gutterBottom>
                    <span>
                      <b>Difficulty to administer: </b>
                    </span>{' '}
                    3
                  </Typography>
                </DialogContent>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ButtonFooter
                    email={user.email}
                    admin={user.admin}
                    status={user.status}
                    acceptUser={acceptUser}
                    updateAdmin={updateAdmin}
                    removeUser={removeUser}
                    close={handleClose}
                  />
                </div>
              </>
            </BootstrapDialog>
          </>,
        ),
      )}
      columns={columns}
    />
  );
}

export default UserTable;
