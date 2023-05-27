/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import { useData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import IUser from '../util/types/user';
import ButtonContainer from './ButtonContainer';

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
    let outStatus = status || 'N/A';
    if (admin) {
      outStatus = 'Admin';
    }
    const outDate = date || 'No Date';
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

  const [userList, setUserList] = useState<IUser[]>([]);
  const users = useData('admin/all');
  const self = useAppSelector(selectUser);

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
        newEntry.status = 'Approved';
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
          <ButtonContainer
            user={user}
            acceptUser={acceptUser}
            updateAdmin={updateAdmin}
            removeUser={removeUser}
          />,
        ),
      )}
      columns={columns}
    />
  );
}

export default UserTable;
