/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-nested-ternary */
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
import React, { useEffect, useState } from 'react';
import { getData } from '../util/api';
import PrimaryButton from './buttons/PrimaryButton';

interface Item {
  name: string;
  disorders: string[];
  formats: string[];
  interventionTypes: string[];
  isChildAppropriate: boolean;
  isAdultAppropriate: boolean;
  maturity: string[];
  keywords: string[];
  modifications: string;
  link: string;
  updatedAt: string;
}

interface PopupProps {
  category: string;
  setPopupState: React.Dispatch<React.SetStateAction<string>>;
  setCurItem: React.Dispatch<React.SetStateAction<Item>>;
}

function Popup({ category, setPopupState, setCurItem }: PopupProps) {
  const [val, setVal] = useState('');
  const [values, setValues] = useState({
    disorders: [],
    formats: [],
    interventionTypes: [],
    maturity: ['Child', 'Adult'],
    keywords: [],
  });
  useEffect(() => {
    const fetch = async () => {
      const disorders = (await getData('exposure/disorders')).data;
      const emp: Object[] = [];
      const flattenedObj = Object.assign(
        {},
        ...(function flatten(o: any): Object[] {
          return emp.concat(
            ...Object.keys(o).map((k) => {
              if (typeof o[k] === 'boolean') {
                return { [k]: 'temp' };
              }
              return [...flatten(o[k]), { [k]: 'temp' }];
            }),
          );
        })(disorders),
      );
      const itemsBelow: any = Object.keys(flattenedObj);

      const formats = (await getData('exposure/formats')).data;
      const interventionTypes = (await getData('exposure/interventionTypes'))
        .data;
      const keywords = (await getData('exposure/keywords')).data;
      setValues({
        disorders: itemsBelow,
        formats,
        interventionTypes,
        maturity: ['Child', 'Adult'],
        keywords,
      });
    };
    fetch();
  }, []);
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
              options={
                category === 'disorders'
                  ? values.disorders
                  : category === 'formats'
                  ? values.formats
                  : category === 'interventionTypes'
                  ? values.interventionTypes
                  : category === 'maturity'
                  ? values.maturity
                  : category === 'keywords'
                  ? values.keywords
                  : []
              }
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
                Object(prev)[category].push(val);
                return prev;
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
