/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays all the information
 * about a hierarchy.
 */
import React from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ModeRoundedIcon from '@mui/icons-material/ModeRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Mode } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { ViewHierarchyTable } from '../components/ViewHierarchyTable';

const ViewHierarchyPage = function () {
  const rows = [
    {
      key: '1',
      no: 1,
      itemName: 'Write your own obituary',
      suds: '_____',
    },
    {
      key: '2',
      no: 2,
      itemName: 'Young boy gets blood drawn',
      suds: '_____',
    },
    {
      key: '3',
      no: 3,
      itemName: 'Young girl gets a painfree shot',
      suds: '_____',
    },
  ];

  const columns = [
    { id: 'no', label: 'No.', minWidth: 100 },
    { id: 'itemName', label: 'Item Name', minWidth: 170 },
    { id: 'suds', label: 'SUDS', minWidth: 100 },
  ];

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ArrowBackRoundedIcon
            sx={{
              color: 'black',
            }}
          />
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
              borderColor: 'blue',
              color: 'blue',
              textTransform: 'none',
              margin: '0px 5px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.8)',
            }}
          >
            Export as CSV <DownloadRoundedIcon />
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
      <p style={{ padding: '0px 0px 30px 45px' }}>
        Taran is a sophomore in college. This is a comment.
      </p>
      <ViewHierarchyTable rows={rows} columns={columns} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '55px',
        }}
      >
        <TextField
          id="outlined-basic"
          label="Add Custom Item"
          variant="outlined"
        />
        <Button
          variant="outlined"
          sx={{
            maxWidth: '180px',
            height: '40px',
            borderColor: 'blue',
            color: 'blue',
            textTransform: 'none',
            margin: '0px 5px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.8)',
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default ViewHierarchyPage;
