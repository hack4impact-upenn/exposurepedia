import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { approveUser } from './api';
import LoadingButton from '../components/buttons/LoadingButton';

interface ApproveUserButtonProps {
  status: string;
  email: string;
  acceptUser: (email: string) => void;
  close: () => void;
}

/**
 * The button component which, when clicked, will approve a user access to app.
 * @param status - user status (approved, pending)
 * @param email - the email of the user to approve
 * @param rejectUser - a function which updates the user status on the frontend
 * representation of the set of users. This function is called upon successfully
 * approving user access.
 */
function ApproveUserButton({
  status,
  email,
  acceptUser,
  close,
}: ApproveUserButtonProps) {
  const [isLoading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    if (await approveUser(email)) {
      acceptUser(email);
    }
    setLoading(false);
    close();
  }
  if (isLoading) {
    return <LoadingButton />;
  }
  if (status === 'Pending' || !status) {
    return (
      <Button
        style={{ color: 'green', borderColor: 'green' }}
        variant="outlined"
        onClick={() => handleApprove()}
      >
        Confirm
      </Button>
    );
  }
  return (
    <Button variant="outlined" disabled>
      Already Approved
    </Button>
  );
}

export default ApproveUserButton;
