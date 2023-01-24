import React from 'react';
import { ExposureItemTable } from '../Exposurepedia/ExposureItemTable';

const FixLinksPage = function () {
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
  ];

  const columns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'format', label: 'Format', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 100 },
  ];

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <h1> Fix Broken Links </h1>
      <ExposureItemTable
        rows={rows}
        columns={columns}
        isApprove={false}
        isBroken
      />
    </div>
  );
};

export default FixLinksPage;
