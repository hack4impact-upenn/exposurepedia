import {
  Box,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';

interface PopupProps {
  setPopupState: React.Dispatch<React.SetStateAction<string>>;
}

function UploadFromCSVPopup({ setPopupState }: PopupProps) {
  const [value, setValue] = useState('');
  const [valueDescr, setValueDescr] = useState('');
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const email = user?.email?.toLowerCase();

  return (
    <Dialog open onClose={() => setPopupState('')} maxWidth="sm" fullWidth>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <Typography variant="h5">Upload CSV</Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <DialogContent sx={{ width: '100%' }}>
            <Button variant="contained" component="label">
              Select File(s)
              <input type="file" hidden />
            </Button>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <TextField
                value={value}
                variant="standard"
                fullWidth
                label="Name"
                onChange={(event) => setValue(event.target.value)}
                sx={{ marginBottom: '10px' }}
              />
              <TextField
                value={valueDescr}
                variant="standard"
                label="Description"
                fullWidth
                multiline
                rows={2}
                onChange={(event) => setValueDescr(event.target.value)}
              />
            </div>
          </DialogContent>
          <Button
            type="submit"
            onClick={() => {
              setPopupState('');
            }}
          >
            Upload
          </Button>
        </div>
      </Box>
    </Dialog>
  );
}

export default UploadFromCSVPopup;
