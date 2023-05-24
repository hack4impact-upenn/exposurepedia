import { Button } from '@mui/material';
import React, { useState } from 'react';
import ApproveUserButton from './ApproveUserButton';
import DeleteUserButton from './DeleteUserButton';
import PromoteUserButton from './PromoteUserButton';

interface ButtonFooterProps {
  email: string;
  admin: boolean;
  status: string;
  acceptUser: (email: string) => void;
  updateAdmin: (email: string) => void;
  removeUser: (email: string) => void;
  close: () => void;
}

function ButtonFooter({
  email,
  admin,
  status,
  acceptUser,
  updateAdmin,
  removeUser,
  close,
}: ButtonFooterProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLeft, setIsLeft] = useState(true);

  if (admin) {
    return <p style={{ color: 'gray' }}>Already Approved</p>;
  }

  if (!status || status === 'Pending') {
    if (!isConfirmed) {
      return (
        <>
          <Button
            style={{ color: 'green', borderColor: 'green' }}
            variant="outlined"
            onClick={() => {
              setIsConfirmed(true);
              setIsLeft(true);
            }}
          >
            Approve User
          </Button>
          <span style={{ padding: '0px 10px' }} />
          <Button
            style={{ color: 'red', borderColor: 'red' }}
            variant="outlined"
            onClick={() => {
              setIsConfirmed(true);
              setIsLeft(false);
            }}
          >
            Delete User
          </Button>
        </>
      );
    }
    if (isLeft) {
      return (
        <>
          <ApproveUserButton
            status={status}
            email={email}
            acceptUser={acceptUser}
            close={close}
          />
          <span style={{ padding: '0px 10px' }} />
          <Button
            style={{ color: 'gray', borderColor: 'gray' }}
            variant="outlined"
            onClick={() => {
              setIsConfirmed(false);
            }}
          >
            Cancel
          </Button>
        </>
      );
    }
    return (
      <>
        <DeleteUserButton
          admin={admin}
          email={email}
          removeRow={() => removeUser(email)}
          close={close}
        />
        <span style={{ padding: '0px 10px' }} />
        <Button
          style={{ color: 'gray', borderColor: 'gray' }}
          variant="outlined"
          onClick={() => {
            setIsConfirmed(false);
          }}
        >
          Cancel
        </Button>
      </>
    );
  }

  if (!isConfirmed) {
    return (
      <>
        <Button
          style={{ color: 'green', borderColor: 'green' }}
          variant="outlined"
          onClick={() => {
            setIsConfirmed(true);
            setIsLeft(true);
          }}
        >
          Promote User
        </Button>
        <span style={{ padding: '0px 10px' }} />
        <Button
          style={{ color: 'red', borderColor: 'red' }}
          variant="outlined"
          onClick={() => {
            setIsConfirmed(true);
            setIsLeft(false);
          }}
        >
          Delete User
        </Button>
      </>
    );
  }
  if (isLeft) {
    return (
      <>
        <PromoteUserButton
          admin={admin}
          email={email}
          updateAdmin={updateAdmin}
          close={close}
        />
        <span style={{ padding: '0px 10px' }} />
        <Button
          style={{ color: 'gray', borderColor: 'gray' }}
          variant="outlined"
          onClick={() => {
            setIsConfirmed(false);
          }}
        >
          Cancel
        </Button>
      </>
    );
  }
  return (
    <>
      <DeleteUserButton
        admin={admin}
        email={email}
        removeRow={() => removeUser(email)}
        close={close}
      />
      <span style={{ padding: '0px 10px' }} />
      <Button
        style={{ color: 'gray', borderColor: 'gray' }}
        variant="outlined"
        onClick={() => {
          setIsConfirmed(false);
        }}
      >
        Cancel
      </Button>
    </>
  );
}

export default ButtonFooter;
