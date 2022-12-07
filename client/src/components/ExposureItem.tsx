import React, { useState } from 'react';
import {
  Box,
  Chip,
  Link,
  Paper,
  Typography,
  Button,
  TextField,
  Toolbar,
} from '@mui/material';
import {
  Cancel,
  FavoriteBorder,
  Favorite,
  AddCircle,
} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useLocation } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import Popup from './Popup';

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
  const [liked, setLiked] = useState(false);
  const [popupState, setPopupState] = useState('');
  const [curItem, setCurItem] = useState(item);
  const [savedItem, setSavedItem] = useState(item);
  const location = useLocation();
  const { isApprove, isBroken } = location.state;
  console.log(isApprove);
  console.log(isBroken);
  const saveChanges = () => {
    setIsEdit(false);
    setSavedItem(curItem);
    console.log('saved!');
  };

  const cancelChanges = () => {
    setIsEdit(false);
    setCurItem(savedItem);
    console.log('cancelled!');
  };

  const handleDelete = (key: string, data: string) => {
    setCurItem((prevItem) => {
      const usedKey = key as keyof Item;
      const newsavedItem: Item = JSON.parse(JSON.stringify(prevItem));
      const changedArray: string[] = prevItem[usedKey] as string[];
      return {
        ...newsavedItem,
        [usedKey]: changedArray.filter((changedItem) => changedItem !== data),
      };
    });
  };

  return (
    <div>
      <Toolbar />
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
                  onChange={(e) => {
                    setCurItem((prevItem) => ({
                      ...prevItem,
                      title: e.target.value,
                    }));
                  }}
                  defaultValue={curItem.title}
                />
              ) : (
                <strong style={{ width: '600px' }}>{curItem.title}</strong>
              )}
            </Typography>
            {liked ? (
              <Favorite
                style={{ color: 'CF0C0C' }}
                onClick={() => setLiked((prevLiked) => !prevLiked)}
              />
            ) : (
              <FavoriteBorder
                style={{ color: 'CF0C0C' }}
                onClick={() => setLiked((prevLiked) => !prevLiked)}
              />
            )}

            <Typography color="GrayText">0</Typography>
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
              <>
                <Button
                  variant="outlined"
                  sx={{
                    maxWidth: '200px',
                    borderColor: 'green',
                    color: 'green',
                  }}
                  onClick={() => saveChanges()}
                >
                  <span style={{ marginRight: '5px' }}>Save Changes</span>
                  <CheckIcon />
                </Button>
                <Button
                  variant="outlined"
                  sx={{ maxWidth: '200x', borderColor: 'gray', color: 'gray' }}
                  onClick={() => cancelChanges()}
                >
                  <span style={{ marginRight: '5px' }}>Cancel Changes</span>
                  <CheckIcon />
                </Button>
              </>
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
          (key) => {
            return (
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
                {Object(curItem)[key].map((data: string) => (
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
                    label={data}
                    onDelete={() => {
                      handleDelete(key, data);
                    }}
                    deleteIcon={
                      isEdit ? (
                        <Cancel sx={{ backgroundClip: 'red' }} />
                      ) : (
                        <span />
                      )
                    }
                  />
                ))}
                {isEdit && (
                  <AddCircle
                    style={{ color: '009054' }}
                    onClick={() => setPopupState(key)}
                  />
                )}
                {/* {popupState === key && <Popup category={key} />} */}
                {popupState === key && (
                  <Popup
                    category={key}
                    setPopupState={setPopupState}
                    setCurItem={setCurItem}
                  />
                )}
              </Box>
            );
          },
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
                onChange={(e) => {
                  setCurItem((prevItem) => ({
                    ...prevItem,
                    modifications: e.target.value,
                  }));
                }}
                defaultValue={curItem.modifications}
              />
            ) : (
              <span style={{ width: '500px' }}>{curItem.modifications}</span>
            )}
          </Typography>
        </Box>
        {curItem.link !== '' && (
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
                <Link href={curItem.link}>{curItem.link}</Link>
              </Typography>
            </Box>
            {curItem.link.includes('youtube') && (
              <iframe
                width="640"
                height="480"
                src={`https://www.youtube.com/embed/${curItem.link
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
