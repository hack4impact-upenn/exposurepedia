/* eslint-disable no-promise-executor-return */
import {
  Box,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const email = user?.email?.toLowerCase();

  const parseCSV = async (img: any) => {
    setIsUploading(true);
    setFileUploaded(false);
    const sleep = (ms: number) => new Promise((r: any) => setTimeout(r, ms));
    await sleep(2000);
    setIsUploading(false);
    setFileUploaded(true);
  };

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
          <DialogContent
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Button variant="contained" component="label">
              Select File(s)
              <input type="file" accept=".csv" hidden onChange={parseCSV} />
            </Button>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {isUploading && <CircularProgress sx={{ marginTop: '20px' }} />}
              {fileUploaded && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <p style={{ fontSize: '24px', marginRight: '5px' }}>
                    Successfully uploaded
                  </p>
                  <CheckCircleOutlineIcon
                    sx={{ color: 'green', fontSize: '36px' }}
                  />
                </div>
              )}
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
