import { Toolbar } from '@mui/material';
import React from 'react';
import { ExposureItemTable } from '../Exposurepedia/ExposureItemTable';

const ApproveResourcesPage = function () {
  const rows = [
    {
      key: '1',
      title: 'Write your own obituary',
      format: 'Idea',
      likes: 45,
      date: '2021-10-10',
    },
    {
      key: '2',
      title: 'Young boy gets blood drawn',
      format: 'Reading',
      likes: 2,
      date: '2022-10-2',
    },
    {
      key: '3',
      title: 'Young girl gets a painfree shot',
      format: 'Video',
      likes: 100,
      date: '2021-11-04',
    },
    {
      key: '4',
      title:
        'Leave electrical appliances plugged in/lights on (e.g., coffee maker) ',
      format: 'Idea',
      likes: 51,
      date: '2021-11-24',
    },
    {
      key: '5',
      title: 'The Office: Michael accidentally hits Meredith with his car',
      format: 'Video',
      likes: 10,
      date: '2021-11-24',
    },
    {
      key: '6',
      title: 'Write your own obituary',
      format: 'Reading',
      likes: 74,
      date: '2021-12-01',
    },
    {
      key: '7',
      title: 'Write something inaccurate on social media',
      format: 'Idea',
      likes: 2,
      date: '2021-12-03',
    },
    {
      key: '8',
      title:
        'Write an insult about therapist and reflect on how that might make you...',
      format: 'Idea',
      likes: 0,
      date: '2021-12-14',
    },
  ];

  const columns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'format', label: 'Format', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 100 },
  ];

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <Toolbar />
      <h1> Approve Resources </h1>
      <ExposureItemTable
        rows={rows}
        columns={columns}
        isApprove
        isBroken={false}
      />
    </div>
  );
};

export default ApproveResourcesPage;
