import {
  Button,
  Dialog,
  DialogContent,
  styled,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import IUser from '../util/types/user';
import ButtonFooter from './ButtonFooter';
import PopupDialog from './PopupDialog';

interface ButtonContainerProps {
  user: IUser;
  acceptUser: (email: string) => void;
  updateAdmin: (email: string) => void;
  removeUser: (email: string) => void;
}

const BootstrapDialog = styled(Dialog)(() => ({}));

function ButtonContainer({
  user,
  acceptUser,
  updateAdmin,
  removeUser,
}: ButtonContainerProps) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = (userId: number) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
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
        open={open}
      >
        <>
          <PopupDialog id="customized-dialog-title" onClose={handleClose}>
            {`${user.firstName} ${user.lastName}`}
          </PopupDialog>
          <DialogContent>
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
              margin: '20px 0px',
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
    </div>
  );
}

export default ButtonContainer;
