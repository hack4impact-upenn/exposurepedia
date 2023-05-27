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
import CancelIcon from '@mui/icons-material/Cancel';
import Papa from 'papaparse';
import { postData } from '../util/api';

interface PopupProps {
  setPopupState: React.Dispatch<React.SetStateAction<string>>;
}

function UploadFromCSVPopup({ setPopupState }: PopupProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failed, setFailed] = useState<any[]>([]);

  const parseCSV = async (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      async complete(results: any) {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        setIsUploading(true);
        setErrorCount(0);
        setIsError(false);
        setFileUploaded(false);
        for (let i = 0; i < results.data.length; i += 1) {
          const exposure: any = results.data[i];
          // disorders
          const disorder1 = exposure.disorders_1
            ? exposure.disorders_1.split(',').map((s: string) => s.trim())
            : null;
          const disorder2 = exposure.disorders_2
            ? exposure.disorders_2.split(',').map((s: string) => s.trim())
            : [];
          const disorder3 = exposure.disorders_3
            ? exposure.disorders_3.split(',').map((s: string) => s.trim())
            : [];
          const disorder4 = exposure.disorders_4
            ? exposure.disorders_4.split(',').map((s: string) => s.trim())
            : [];
          // formats
          const formats = exposure.formats
            ? exposure.formats.split(',').map((s: string) => s.trim())
            : [];
          // intervention types
          const interventionTypes = exposure.interventionTypes
            ? exposure.interventionTypes.split(',').map((s: string) => s.trim())
            : [];
          // keywords
          const keywords = exposure.keywords
            ? exposure.keywords.split(';').map((s: string) => s.trim())
            : [];
          const exposureItem = {
            name: exposure.name,
            disorder1,
            disorder2,
            disorder3,
            disorder4,
            formats,
            interventionTypes,
            isAdultAppropriate: exposure.isAdultAppropriate === 'yes',
            isChildAppropriate: exposure.isChildAppropriate === 'yes',
            keywords,
            modifications: exposure.modifications,
            link: exposure.link,
            isAdminUpload: true,
          };

          // eslint-disable-next-line no-await-in-loop
          const res = await postData('exposure', exposureItem);
          console.log(res);
          if (res.error) {
            console.log(res.error);
            setErrorCount((c) => c + 1);
            setIsError(true);
            // add exposure name and row number to failed list
            setFailed((f) => [...f, { name: exposure.name, row: i + 1 }]);
          } else {
            setSuccessCount((c) => c + 1);
          }
        }
        setIsUploading(false);
        if (!isError) {
          setFileUploaded(true);
        }
      },
    });
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
              {!isError && fileUploaded && (
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
              {isError && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <p style={{ fontSize: '24px', marginRight: '5px' }}>
                    Successfully uploaded {successCount} items, but encountered
                    errors uploading {errorCount} items:
                    {failed.map((f) => (
                      <p style={{ fontSize: '18px' }}>
                        {f.name} (row {f.row})
                      </p>
                    ))}
                  </p>
                  <CancelIcon sx={{ color: 'red', fontSize: '36px' }} />
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
