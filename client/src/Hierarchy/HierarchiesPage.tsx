/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import { Button, Grid, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import HierarchyListItem from '../components/HierarchyListItem';

const styles = {
  button: {
    padding: '8px 15px',
    'text-transform': 'none',
    fontSize: '16px',
  },
};

const hierarchyList = [
  { name: 'Obsessive Compulsive Disorder (OCD)', date: '2021-01-01' },
  { name: 'Generalized Anxiety', date: '2021-01-01' },
  { name: 'Social Anxiety', date: '2021-01-01' },
  { name: 'Body Dismorphia', date: '2021-01-01' },
  { name: 'Fear of Being Misunderstood', date: '2021-01-01' },
  { name: 'Social Anxiety', date: '2021-01-01' },
];

function HierarchyPage() {
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
          {hierarchyList.map((hierarchy) => (
            <HierarchyListItem
              key={hierarchy.name}
              index={hierarchyList.indexOf(hierarchy)}
              name={hierarchy.name}
              date={hierarchy.date}
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
          <Button variant="contained" style={styles.button}>
            Add New Hierarchy
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HierarchyPage;
