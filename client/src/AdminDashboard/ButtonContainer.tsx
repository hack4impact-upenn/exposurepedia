import {
  Button,
  Dialog,
  DialogContent,
  styled,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { getData } from '../util/api';
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
  const [userInfo, setUserInfo] = useState({
    isProfessional: false,
    profession: '',
    settings: [],
    percentCaseload: 0,
    difficulty: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line no-underscore-dangle
      const userRes = await getData(`auth/user/${user._id}`);
      setUserInfo(userRes.data);
    };
    fetchData();
  }, [user]);

  const handleClickOpen = () => {
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
        onClick={() => handleClickOpen()}
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
                <b>Licensed provider: </b>
              </span>{' '}
              {userInfo.isProfessional ? 'Yes' : 'No'}
            </Typography>
            <Typography gutterBottom>
              <span>
                <b>Profession: </b>
              </span>{' '}
              {userInfo.profession}
            </Typography>
            <Typography gutterBottom>
              <span>
                <b>Primary work setting(s): </b>
              </span>{' '}
              {userInfo.settings.join(', ')}
            </Typography>
            <Typography gutterBottom>
              <span>
                <b>Exposure therapy use in caseload: </b>
              </span>{' '}
              {`${userInfo.percentCaseload}%`}
            </Typography>
            <Typography gutterBottom>
              <span>
                <b>
                  Perceived difficulty of administering exposure therapy (1-7):{' '}
                </b>
              </span>{' '}
              {userInfo.difficulty}
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
