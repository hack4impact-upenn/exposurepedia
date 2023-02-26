import {
  Box,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { addHierarchy } from './api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';

interface PopupProps {
  setPopupState: React.Dispatch<React.SetStateAction<string>>;
  addToHierarchies: React.Dispatch<React.SetStateAction<any>>;
}

function AddHierarchyPopup({ setPopupState, addToHierarchies }: PopupProps) {
  const [value, setValue] = useState('');
  const [valueDescr, setValueDescr] = useState('');
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const email = user?.email?.toLowerCase();

  async function createHierarchy() {
    if (value && valueDescr && email) {
      addToHierarchies({ title: value, updated_at: Date.now() });
      const res = await addHierarchy(email, value, valueDescr);
      setPopupState('');
      navigate('/viewhierarchy', {
        state: {
          id: res,
        },
      });
    }
  }

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
        <Typography variant="h5">Add Hierarchy</Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <DialogContent sx={{ width: '100%' }}>
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
          <PrimaryButton
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => createHierarchy()}
          >
            Add
          </PrimaryButton>
        </div>
      </Box>
    </Dialog>
  );
}

export default AddHierarchyPopup;
