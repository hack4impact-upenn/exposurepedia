/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays all the information
 * about a hierarchy.
 */
import React from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ModeRoundedIcon from '@mui/icons-material/ModeRounded';
import { Mode } from '@mui/icons-material';
import { ViewHierarchyTable } from '../components/ViewHierarchyTable';

const ViewHierarchyPage = function () {
  const rows = [
    {
      key: '1',
      no: 1,
      itemName: 'Write your own obituary',
      suds: 'cakjsna',
    },
    {
      key: '2',
      no: 2,
      itemName: 'Young boy gets blood drawn',
      suds: 'casc',
    },
    {
      key: '3',
      no: 3,
      itemName: 'Young girl gets a painfree shot',
      suds: 'cklsnaj',
    },
  ];

  const columns = [
    { id: 'no', label: 'No.', minWidth: 100 },
    { id: 'itemName', label: 'Item Name', minWidth: 170 },
    { id: 'suds', label: 'SUDS', minWidth: 100 },
  ];

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <div style={{ display: 'flex' }}>
        <ArrowBackRoundedIcon
          sx={{
            color: 'black',
            margin: '0px 5px',
          }}
        />
        <div>
          <h1> Hierarchy 1: XYZ Disorder </h1>
          <p style={{ padding: '0px 0px 30px 0px' }}>
            Taran is a sophomore in college. This is a comment.
          </p>
        </div>
        <ModeRoundedIcon
          sx={{
            color: 'black',
            margin: '0px 5px',
          }}
        />
      </div>
      <ViewHierarchyTable rows={rows} columns={columns} />
    </div>
  );
};

export default ViewHierarchyPage;
