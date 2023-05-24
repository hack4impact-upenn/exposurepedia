import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { deleteUser } from './api';
import LoadingButton from '../components/buttons/LoadingButton';

interface DeleteUserButtonProps {
  admin: boolean;
  email: string;
  removeRow: (user: string) => void;
  close: () => void;
}

/**
 * The button component which, when clicked, will delete the user from the database.
 * If the user is an admin, the button will be unclickable.
 * @param admin - whether the user is an admin
 * @param email - the email of the user to delete
 * @param removeRow - a function which removes a row from the user table. This
 * function is called upon successfully deletion of user from the database.
 */
function DeleteUserButton({
  admin,
  email,
  removeRow,
  close,
}: DeleteUserButtonProps) {
  const [isLoading, setLoading] = useState(false);
  async function handleDelete() {
    setLoading(true);
    if (await deleteUser(email)) {
      removeRow(email);
    } else {
      setLoading(false);
    }
    close();
  }
  if (isLoading) {
    return <LoadingButton />;
  }
  if (!admin) {
    return (
      <Button
        style={{ color: 'green', borderColor: 'green' }}
        variant="outlined"
        onClick={() => handleDelete()}
      >
        Confirm
      </Button>
    );
  }
  return (
    <Button variant="outlined" disabled>
      User is Admin
    </Button>
  );
}

export default DeleteUserButton;
