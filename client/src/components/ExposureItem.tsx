import React, { useState } from 'react';
import {
  Box,
  Chip,
  Link,
  Paper,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import { Cancel, FavoriteBorder } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Warning';

interface ExposureItemProps {
  item: Item;
}

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

export default function ExposureItem({ item }: ExposureItemProps) {
  const [isEdit, setIsEdit] = useState(false);
  const location = useLocation();
  const { isApprove, isBroken } = location.state;
  console.log(isApprove);
  console.log(isBroken);

  const saveChanges = () => {
    setIsEdit(false);
    console.log('saved!');
  };
  return (
    <div>
      {isApprove && (
        <div
          style={{
            width: '100%',
            background: '#f5f5f5',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            margin: '0px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '10px 0px',
          }}
        >
          <p style={{ margin: '0px' }}>This resource is awaiting approval</p>
          <div style={{ marginTop: '10px' }}>
            <Button
              variant="outlined"
              sx={{
                maxWidth: '180px',
                height: '30px',
                borderColor: 'green',
                color: 'green',
                textTransform: 'none',
                margin: '0px 5px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.8)',
              }}
              onClick={() => saveChanges()}
            >
              Approve Resource
            </Button>
            <Button
              variant="outlined"
              sx={{
                maxWidth: '180px',
                height: '30px',
                borderColor: 'red',
                color: 'red',
                textTransform: 'none',
                margin: '0px 5px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.8)',
              }}
              onClick={() => saveChanges()}
            >
              Reject Resource
            </Button>
          </div>
        </div>
      )}
      {isBroken && (
        <div
          style={{
            width: '100%',
            background: '#f5f5f5',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            margin: '0px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '10px 0px',
          }}
        >
          <p style={{ margin: '0px', display: 'flex', alignItems: 'center' }}>
            {' '}
            <WarningIcon
              sx={{
                color: '#EDDD4E',
                margin: '0px 5px',
              }}
            />{' '}
            This resource has a broken link
          </p>
          <div style={{ marginTop: '10px' }}>
            <Button
              variant="outlined"
              sx={{
                maxWidth: '180px',
                height: '30px',
                borderColor: 'green',
                color: 'green',
                textTransform: 'none',
                margin: '0px 5px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.8)',
              }}
              onClick={() => saveChanges()}
            >
              Approve Resource
            </Button>
            <Button
              variant="outlined"
              sx={{
                maxWidth: '180px',
                height: '30px',
                borderColor: 'red',
                color: 'red',
                textTransform: 'none',
                margin: '0px 5px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.8)',
              }}
              onClick={() => saveChanges()}
            >
              Reject Resource
            </Button>
          </div>
        </div>
      )}
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          margin: '1rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ mr: '0.25rem' }}>
              {isEdit ? (
                <TextField
                  sx={{ width: '750px' }}
                  InputProps={{
                    style: { fontSize: '24px', fontWeight: 'bold' },
                  }}
                  id="standard-basic"
                  variant="standard"
                  defaultValue={item.title}
                />
              ) : (
                <strong style={{ width: '600px' }}>{item.title}</strong>
              )}
            </Typography>
            <FavoriteBorder />
            <Typography>0</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Typography>Last updated October 1st 2022</Typography>
            {isEdit ? (
              <Button
                variant="outlined"
                sx={{ maxWidth: '180px', borderColor: 'green', color: 'green' }}
                onClick={() => saveChanges()}
              >
                <span style={{ marginRight: '5px' }}>Save Changes</span>
                <CheckIcon />
              </Button>
            ) : (
              <Button
                variant="outlined"
                sx={{ maxWidth: '140px' }}
                onClick={() => setIsEdit(true)}
              >
                <span style={{ marginRight: '5px' }}>Edit Item</span>
                <EditIcon />
              </Button>
            )}
          </Box>
        </Box>

        {['disorder', 'format', 'interventionType', 'maturity', 'keywords'].map(
          (key) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                my: '0.25rem',
              }}
            >
              <Typography>
                <strong>{key[0].toUpperCase() + key.substring(1)}:</strong>{' '}
              </Typography>
              {Object(item)[key].map((value: string) => (
                <Chip
                  sx={{
                    mx: '0.25rem',
                    background: '#397FBF',
                    color: 'white',
                    height: '30px',
                    margin: '2px',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(237,237,237,0.9)',
                    },
                  }}
                  label={value}
                  onDelete={() => ({})}
                  deleteIcon={
                    isEdit ? (
                      <Cancel sx={{ backgroundClip: 'red' }} />
                    ) : (
                      <span />
                    )
                  }
                />
              ))}
            </Box>
          ),
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            my: '0.25rem',
          }}
        >
          <Typography>
            <strong>Modifications: </strong>
            {isEdit ? (
              <TextField
                sx={{ width: '350px' }}
                InputProps={{ style: { fontSize: '16px' } }}
                id="standard-basic"
                variant="standard"
                defaultValue={item.modifications}
              />
            ) : (
              <span style={{ width: '500px' }}>{item.modifications}</span>
            )}
          </Typography>
        </Box>
        {item.link !== '' && (
          <div>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                my: '0.25rem',
              }}
            >
              <Typography>
                <strong>Link: </strong>
                <Link href={item.link}>{item.link}</Link>
              </Typography>
            </Box>
            {item.link.includes('youtube') && (
              <iframe
                width="640"
                height="480"
                src={`https://www.youtube.com/embed/${item.link
                  .split('=')
                  .at(-1)}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
              />
            )}
          </div>
        )}
      </Paper>
    </div>
  );
}
