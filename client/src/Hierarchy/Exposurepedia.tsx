/* eslint-disable react/react-in-jsx-scope */

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ExposureItemTable } from '../components/ExposureItemTable';
import HierarchyDropdown from './HierarchyDropdown';
import Filtering from './Filtering';

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
    { id: 'checkbox', label: '', minWidth: 15 },
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'format', label: 'Format', minWidth: 100 },
    { id: 'likes', label: 'Likes', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 100 },
  ];

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Filtering />
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
