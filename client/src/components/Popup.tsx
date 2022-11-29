import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Autocomplete,
  Box,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import PrimaryButton from './buttons/PrimaryButton';

interface Item {
  title: string;
  disorder: string[];
  format: string[];
  interventionType: string[];
  maturity: string[];
  keywords: string[];
  modifications: string;
  link: string;
}

interface PopupProps {
  category: string;
  setPopupState: React.Dispatch<React.SetStateAction<string>>;
  setCurItem: React.Dispatch<React.SetStateAction<Item>>;
}

const disorders: string[] = [
  'Body Dysmorphia',
  'Bulimia',
  'Anorexia',
  'BDD',
  'Depression',
  'Anxiety',
  'OCD',
  'PTSD',
  'Schizophrenia',
  'Bipolar',
  'ADHD',
  'Autism',
  'Dyslexia',
  'Dyscalculia',
  'Dysgraphia',
  'Dyspraxia',
  'Dysphasia',
  'Dysphagia',
];

function Popup({ category, setPopupState, setCurItem }: PopupProps) {
  const [val, setVal] = useState('');
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function, react/jsx-boolean-value
    <Dialog
      open
      onClose={() => {
        setPopupState('');
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <Typography variant="h5">
          Add {category.charAt(0).toUpperCase() + category.slice(1)}
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <DialogContent>
            <Autocomplete
              id="combo-box-demo"
              onChange={(event, value) => setVal(value || '')}
              options={disorders}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                />
              )}
            />
          </DialogContent>
          <PrimaryButton
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {
              setCurItem((prev) => {
                const newCurItem = { ...prev };
                Object(newCurItem)[category].push(val);
                console.log(newCurItem);
                return newCurItem;
              });
              setPopupState('');
            }}
          >
            Add
          </PrimaryButton>
        </div>
      </Box>
    </Dialog>
  );
}

export default Popup;
