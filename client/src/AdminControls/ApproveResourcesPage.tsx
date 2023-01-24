import { Toolbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ExposureItemTable } from '../Exposurepedia/ExposureItemTable';
import { postData } from '../util/api';

const ApproveResourcesPage = function () {
  const [rows, setRows] = useState([]);

  const columns = [
    { id: 'name', label: 'Title', minWidth: 170 },
    { id: 'formats', label: 'Format', minWidth: 100 },
    { id: 'createdAt', label: 'Date', minWidth: 100 },
  ];

  useEffect(() => {
    const fetch = async () => {
      const response = await postData('exposure/filter', {
        disorders: [],
        formats: [],
        interventionTypes: [],
        isAdultAppropriate: true,
        isChildAppropriate: false,
        keywords: [],
        isLinkBroken: false,
        isApproved: true,
        getApproved: false,
      });
      setRows(response.data);
    };
    fetch();
  }, []);

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
