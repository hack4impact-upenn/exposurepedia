import React, { useState } from 'react';
import { Typography, Grid, IconButton, Stack } from '@mui/material';
import Upload from '@mui/icons-material/Upload';
import ScreenGrid from '../components/ScreenGrid';
import UserTable from './UserTable';
import UploadFromCSVPopup from './UploadFromCSVPopup';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminDashboardPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <ScreenGrid>
      <Grid
        item
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <Typography variant="h2">Welcome to the Admin Dashboard</Typography>
        <div style={{ paddingBottom: 15 }}>
          <Stack direction="row" spacing={2}>
            <Typography variant="h5">Import Exposure Items from CSV</Typography>
            <IconButton
              onClick={() => {
                setIsPopupOpen(true);
              }}
            >
              <Upload
                sx={{
                  color: 'black',
                }}
              />
            </IconButton>
            {isPopupOpen && (
              <UploadFromCSVPopup
                setPopupState={(v: any) => setIsPopupOpen(v)}
              />
            )}
          </Stack>
        </div>
        <div style={{ paddingBottom: 10 }}>
          <Typography variant="h5">Manage Users</Typography>
        </div>
        <div style={{ height: '60vh', width: '60vw' }}>
          <UserTable />
        </div>
      </Grid>
    </ScreenGrid>
  );
}

export default AdminDashboardPage;
