/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import { Button, Grid, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import AddHierarchyPopup from '../components/AddHierarchyPopup';
import HierarchyListItem from '../components/HierarchyListItem';
import { getData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';

const styles = {
  button: {
    padding: '8px 15px',
    'text-transform': 'none',
    fontSize: '16px',
  },
};

export interface HierarchyListItem {
  id: string;
  title: string;
  updated_at: string;
  index: number;
}

function HierarchyPage() {
  const user = useAppSelector(selectUser);
  const email = user?.email?.toLowerCase();
  const emp: any = [];
  const [hierarchies, setHierarchies] = useState(emp);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData(`hierarchy/${email}`);
      console.log(res);
      setHierarchies(res?.data);
    };

    fetchData();
  }, [email]);

  return (
    <Grid
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Grid
        item
        container
        direction="column"
        rowSpacing={3}
        xs={8}
        sm={6}
        fontSize="0.75em"
      >
        <Toolbar />
        <Grid item container justifyContent="flex-start" spacing={0}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
            }}
          >
            Hierarchies
          </Typography>
        </Grid>
        <Grid
          item
          width="1"
          maxHeight="70vh"
          overflow="auto"
          paddingRight="12px"
        >
          {hierarchies?.map((hierarchy: HierarchyListItem) => (
            <HierarchyListItem
              id={hierarchy.id}
              key={hierarchy.title}
              index={hierarchies?.indexOf(hierarchy)}
              name={hierarchy.title}
              date={new Date(hierarchy.updated_at).toLocaleDateString([], {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          ))}
        </Grid>
        <Grid
          item
          container
          justifyContent="center"
          spacing={0}
          marginBottom="20px"
        >
          <Button
            variant="contained"
            style={styles.button}
            onClick={() => {
              setIsPopupOpen(true);
            }}
          >
            Add New Hierarchy
          </Button>
          {isPopupOpen && (
            <AddHierarchyPopup
              addToHierarchies={(h) => {
                const temp = hierarchies;
                temp.push(h);
                setHierarchies(temp);
              }}
              setPopupState={(v: any) => setIsPopupOpen(v)}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HierarchyPage;
