/* eslint-disable no-promise-executor-return */
import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Papa from 'papaparse';
import { postData } from '../util/api';

interface PopupProps {
  setPopupState: React.Dispatch<React.SetStateAction<string>>;
}

function UploadFromCSVPopup({ setPopupState }: PopupProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const parseCSV = async (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      async complete(results) {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (let i = 0; i < 10; i += 1) {
          const exposure: any = results.data[i];
          // for (const exposure in results.data) {
          // disorders
          let disorders = exposure.disorders_1
            ? exposure.disorders_1.split(', ')
            : '';
          const disorders2 = exposure.disorders_2
            ? exposure.disorders_2.split(', ')
            : '';
          const disorders3 = exposure.disorders_3
            ? exposure.disorders_3.split(', ')
            : '';
          const disorders4 = exposure.disorders_4
            ? exposure.disorders_4.split(', ')
            : '';
          if (disorders4.length > 0 && disorders4[0] !== '') {
            disorders = disorders4;
          } else if (disorders3.length > 0 && disorders3[0] !== '') {
            disorders = disorders3;
          } else if (disorders2.length > 0 && disorders2[0] !== '') {
            disorders = disorders2;
          }
          // formats
          const formats = exposure.formats.split(', ');
          // intervention types
          const interventionTypes = exposure.interventionTypes.split(', ');
          // keywords
          const keywords = exposure.keywords.split('; ');

          const exposureItem = {
            name: exposure.name,
            disorders,
            formats,
            interventionTypes,
            isAdultAppropriate: exposure.isAdultAppropriate === 'yes',
            isChildAppropriate: exposure.isChildAppropriate === 'yes',
            keywords,
            modifications: exposure.modifications,
            link: exposure.link,
          };
          // eslint-disable-next-line no-await-in-loop
          const response = await postData('exposure', exposureItem);
          console.log(response);
        }
      },
    });
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
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => parseCSV(e)}
              />
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
            Close
          </Button>
        </div>
      </Box>
    </Dialog>
  );
}

export default UploadFromCSVPopup;
