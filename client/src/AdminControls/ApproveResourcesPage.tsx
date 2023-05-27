import { CircularProgress, Toolbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ExposureItemTable } from '../Exposurepedia/ExposureItemTable';
import { postData } from '../util/api';

function ApproveResourcesPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        isAdultAppropriate: false,
        isChildAppropriate: false,
        keywords: [],
        isLinkBroken: false,
        isApproved: false,
        query: '',
      });
      response.data.forEach((row: any) => {
        const date = new Date(row.createdAt);
        // eslint-disable-next-line no-param-reassign
        row.createdAt = date.toLocaleDateString();
      });
      setRows(response.data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <Toolbar />
      <h1> Approve Resources </h1>
      {isLoading ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <ExposureItemTable
          rows={rows}
          columns={columns}
          isApprove
          isBroken={false}
        />
      )}
    </div>
  );
}

export default ApproveResourcesPage;
