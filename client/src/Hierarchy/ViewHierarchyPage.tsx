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
import { CSVDownload, CSVLink } from 'react-csv';
import { Mode } from '@mui/icons-material';
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
import { updateHierarchy } from './api';
import { ViewHierarchyTable } from '../components/ViewHierarchyTable';
import { getData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';

interface TRow {
  key: string;
  no: number;
  itemName: string;
  suds: string;
  [key: string]: any;
}

const ViewHierarchyPage = function () {
  const user = useAppSelector(selectUser);
  const email = user?.email?.toLowerCase();
  const navigate = useNavigate();
  const location = useLocation();
  const [rows, setRows] = useState<
    { key: string; no: number; itemName: string; suds: string }[]
  >([]);
  const [description, setDescription] = useState('');
  const [hierarchyTitle, setHierarchyTitle] = useState('');
  const [hierarchyId, setHierarchyId] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const res = await getData(`hierarchy/${email}/${location.state.id}`);
      console.log(res);
      setDescription(res?.data?.description);
      setHierarchyTitle(res?.data?.title);
      setHierarchyId(res?.data?.id);
      const items: {
        key: string;
        no: number;
        itemName: string;
        suds: string;
      }[] = [];
      res?.data?.exposure_ids?.forEach((item: [string, string, string]) => {
        const [title, no, suds] = item;
        items.push({
          key: `${no}`,
          no: Number(no),
          itemName: title,
          suds,
        });
      });
      console.log(items);
      setRows(items);
    };

    fetchData();
  }, [email, location.state.id]);
  const [textValue, setTextValue] = useState('');
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
        console.log('to add: ', toAdd);
        updateHierarchy(email, hierarchyId, hierarchyTitle, description, toAdd);
      }
      setTextValue('');
    }
  };

  const getCSVData = (): string[][] => {
    const arr = [];
    arr.push(['no', 'title', 'suds']);
    rows.forEach((row) => arr.push([row.no, row.itemName, row.suds]));
    return arr;
  };

  const columns = [
    { id: 'no', label: 'No.', minWidth: 100 },
    { id: 'itemName', label: 'Item Name', minWidth: 170 },
    { id: 'suds', label: 'SUDS', minWidth: 100 },
  ];

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
          <h1 style={{ padding: '0px 20px 0px 20px' }}>
            {' '}
            Hierarchy 1: XYZ Disorder{' '}
          </h1>
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
              filename="hierarchy 1.csv"
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
          >
            Delete
          </Button>
        </div>
      </div>
      <p style={{ padding: '0px 0px 30px 45px' }}>{description}</p>
      <ViewHierarchyTable
        rows={rows}
        setRows={(r: any) => setRows(r)}
        columns={columns}
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
            Add Custom Item
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={
              <InputAdornment position="start">
                <AddCircleOutlineRoundedIcon />
              </InputAdornment>
            }
            label="Add Custom Item"
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
