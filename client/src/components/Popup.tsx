import {
  Box,
  Chip,
  Link,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from '@mui/material';
import React, { useState } from 'react';

export default function ExposureItem() {
  const [popupState, setPopupState] = useState(false);
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Dialog open={popupState} onClose={() => {}}>
      <DialogTitle>Add new tag</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="New tag"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setPopupState(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setPopupState(false);
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
