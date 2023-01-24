/* eslint-disable react/react-in-jsx-scope */

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import { ExposureItemTable } from '../components/ExposureItemTable';
import HierarchyDropdown from './HierarchyDropdown';
import Filtering2 from './Filtering2';
import { getData } from '../util/api';

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */

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

function Exposurepedia() {
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);

  const hierarchies = [
    'Hierarchy 0',
    'Hierarchy 1',
    'Hierarchy 2',
    'Hierarchy 3',
    'Hierarchy 4',
    'Hierarchy 5',
    'Hierarchy 6',
    'Hierarchy 7',
    'Hierarchy 8',
    'Hierarchy 9',
  ];

  const columns = [
    { id: 'checkbox', label: '', minWidth: 15 },
    { id: 'name', label: 'Title', minWidth: 170 },
    { id: 'format', label: 'Format', minWidth: 100 },
    { id: 'likes', label: 'Likes', minWidth: 100 },
    { id: 'createdAt', label: 'Date', minWidth: 100 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await getData('exposure');
      setRows(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Filtering2 />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <HierarchyDropdown hierarchies={hierarchies} count={count} />
            <ExposureItemTable
              rows={rows}
              columns={columns}
              isApprove={false}
              isBroken={false}
              setCount={setCount}
            />
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default Exposurepedia;
