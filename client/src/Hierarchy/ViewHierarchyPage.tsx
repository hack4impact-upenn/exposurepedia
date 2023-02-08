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
import { CSVLink } from 'react-csv';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Toolbar,
  IconButton,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
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
          key: `${no}`,
          no: Number(no),
          itemName: title,
          suds,
        });
      });
      setRows(items);
    };
    fetchData();
  }, [email, location.state.id]);

  const update = () => {
    if (textValue) {
      const newRows = [
        ...rows,
        {
          key: `${rows.length + 1}`,
          no: rows.length + 1,
          itemName: textValue,
          suds: '',
        },
      ];
      setRows(newRows);
      if (email) {
        const toAdd: [string, string, string][] = newRows.map((row) => [
          row.itemName,
          row.no.toString(),
          row.suds,
        ]);
        updateHierarchy(email, hierarchyId, hierarchyTitle, description, toAdd);
      }
      setTextValue('');
    }
  };

  const handleDelete = async () => {
    await deleteHierarchy(email, hierarchyId);
    navigate('/hierarchies');
  };

  const getCSVData = (): string[][] => {
    const arr = [];
    arr.push(['no', 'title', 'suds']);
    rows.forEach((row) => arr.push([row.no, row.itemName, row.suds]));
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
          <h1 style={{ padding: '0px 20px 0px 20px' }}> {hierarchyTitle} </h1>
          <ModeRoundedIcon
            sx={{
              color: 'black',
            }}
          />
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
      <p style={{ padding: '0px 0px 30px 45px' }}>{description}</p>
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
            startAdornment={
              <InputAdornment position="start">
                <AddCircleOutlineRoundedIcon />
              </InputAdornment>
            }
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
    </div>
  );
};

export default ViewHierarchyPage;
