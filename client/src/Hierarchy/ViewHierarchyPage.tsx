/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays all the information
 * about a hierarchy.
 */
import React, { useState, useEffect } from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ModeRoundedIcon from '@mui/icons-material/ModeRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import { CSVLink } from 'react-csv';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import { ViewHierarchyTable } from './ViewHierarchyTable';
import { updateHierarchy, deleteHierarchy } from './api';
import { getData } from '../util/api';
import { selectUser } from '../util/redux/userSlice';
import { useAppSelector } from '../util/redux/hooks';

const ViewHierarchyPage = function () {
  const navigate = useNavigate();
  const location = useLocation();
  const [rows, setRows] = useState<
    { key: string; no: number; itemName: string; suds: string }[]
  >([]);
  const user = useAppSelector(selectUser);
  const email = user?.email?.toLowerCase() || '';
  const [description, setDescription] = useState('');
  const [hierarchyTitle, setHierarchyTitle] = useState('');
  const [hierarchyId, setHierarchyId] = useState('');
  const [textValue, setTextValue] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [exposureLimitError, setExposureLimitError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData(`hierarchy/${email}/${location.state.id}`);
      setDescription(res.data.description);
      setHierarchyTitle(res.data.title);
      setHierarchyId(res.data.id);
      const items: {
        key: string;
        no: number;
        itemName: string;
        suds: string;
      }[] = [];
      res.data.exposures.forEach((item: [string, string, string]) => {
        const [title, no, suds] = item;
        items.push({
          key: `${uuidv4()}`,
          no: Number(no),
          itemName: title,
          suds,
        });
      });
      setRows(items);
    };
    fetchData();
  }, [email, location.state.id]);

  const update = async () => {
    const exposureLimit = 100;
    if (rows.length >= exposureLimit) {
      setExposureLimitError(true);
      return;
    }
    const newRows = [
      ...rows,
      {
        key: `${uuidv4()}`,
        no: rows.length + 1,
        itemName: textValue,
        suds: '',
      },
    ];
    setRows(newRows);
    setTextValue('');
    if (email) {
      const toAdd: [string, string, string][] = newRows.map((row) => [
        row.itemName,
        row.no.toString(),
        row.suds,
      ]);
      await updateHierarchy(
        email,
        hierarchyId,
        hierarchyTitle,
        description,
        toAdd,
      );
    }
  };

  const updateTitleDesc = async () => {
    if (email) {
      await updateHierarchy(
        email,
        hierarchyId,
        hierarchyTitle,
        description,
        rows.map((row) => [row.itemName, row.no.toString(), row.suds]),
      );
    }
  };

  const handleDelete = async () => {
    await deleteHierarchy(email, hierarchyId);
    navigate('/hierarchies');
  };

  const getCSVData = (): string[][] => {
    const arr = [];
    arr.push(['title', 'suds']);
    rows.forEach((row) => arr.push([row.itemName, row.suds]));
    return arr;
  };

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <Toolbar />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              navigate('/hierarchies');
            }}
          >
            <ArrowBackRoundedIcon
              sx={{
                color: 'black',
              }}
            />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-begin',
              marginTop: '1rem',
              marginBottom: '1rem',
            }}
          >
            <Typography>Last updated March 22nd, 2023</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h5" sx={{ mr: '0.25rem' }}>
                  {isEdit ? (
                    <TextField
                      InputProps={{
                        style: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          width: '400px',
                        },
                      }}
                      id="standard-basic"
                      variant="standard"
                      onChange={(event) => {
                        setHierarchyTitle(event.target.value);
                      }}
                      onBlur={async () => {
                        setIsEdit(false);
                        await updateTitleDesc();
                      }}
                      defaultValue={hierarchyTitle}
                    />
                  ) : (
                    <strong style={{ width: '600px' }}>{hierarchyTitle}</strong>
                  )}
                </Typography>
              </Box>
              {isEdit ? (
                <IconButton
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: 'black',
                    }}
                  />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  <ModeRoundedIcon
                    sx={{
                      color: 'black',
                    }}
                  />
                </IconButton>
              )}
            </Box>
            <Typography variant="h5" sx={{ mr: '0.25rem' }}>
              {isEdit ? (
                <TextField
                  InputProps={{
                    style: {
                      fontSize: '16px',
                      width: '500px',
                    },
                  }}
                  multiline
                  id="standard-basic"
                  variant="standard"
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                  onBlur={async () => {
                    setIsEdit(false);
                    await updateTitleDesc();
                  }}
                  defaultValue={description}
                />
              ) : (
                <Typography variant="subtitle1" sx={{ mr: '0.25rem' }}>
                  {description}
                </Typography>
              )}
            </Typography>
          </Box>
        </div>
        <div>
          <Button
            variant="outlined"
            sx={{
              maxWidth: '180px',
              height: '40px',
              borderColor: '#397FBF',
              color: '#397FBF',
              textTransform: 'none',
              margin: '0px 5px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.8)',
            }}
          >
            <CSVLink
              data={getCSVData()}
              filename={`${hierarchyTitle}.csv`}
              style={{ textDecoration: 'none', color: '#397FBF' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <span>Export as CSV</span>
                <DownloadRoundedIcon />
              </div>
            </CSVLink>
          </Button>
          <Button
            variant="outlined"
            sx={{
              maxWidth: '180px',
              height: '40px',
              borderColor: 'red',
              color: 'red',
              textTransform: 'none',
              margin: '0px 5px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.8)',
            }}
            onClick={() => handleDelete()}
          >
            Delete
          </Button>
        </div>
      </div>
      <ViewHierarchyTable
        rows={rows}
        setRows={(r: any) => setRows(r)}
        email={email}
        hierarchyId={hierarchyId}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '55px',
        }}
      >
        <FormControl sx={{ m: 1, width: '120ch' }}>
          <InputLabel htmlFor="outlined-adornment-amount">
            Add Custom Exposure
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            label="Add Custom Exposure"
            value={textValue}
            onChange={(event) => setTextValue(event.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                update();
              }
            }}
          />
        </FormControl>
        <Button
          variant="outlined"
          sx={{
            maxWidth: '180px',
            height: '40px',
            borderColor: '#397FBF',
            color: '#397FBF',
            textTransform: 'none',
            margin: '0px 5px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.8)',
          }}
          onClick={() => update()}
        >
          Add
        </Button>
      </div>
      {exposureLimitError && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '55px',
          }}
        >
          <Alert severity="error">
            Exposure limit exceeded. Please delete an exposure to add a new one.
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ViewHierarchyPage;
