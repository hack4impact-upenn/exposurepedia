/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import { Grid } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

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
  // eslint-disable-next-line camelcase
  updated_at: string;
  index: number;
}

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
          <p
            style={{
              fontWeight: 'bold',
              margin: '0px',
              marginTop: '20px',
              marginBottom: '5px',
              padding: '0px',
              fontSize: '36px',
            }}
          >
            Modifications
          </p>
          <ul
            style={{
              fontSize: '16px',
              margin: '0px',
              padding: '0px',
              color: '#cc0000',
            }}
          >
            {[
              'Number of safety behaviors/rituals allowed',
              'Presence of others (friends, strangers, therapist)',
              'Degree of contact with feared object (e.g., look, someone else holds, touch, taste, hug, put hand nearby)',
              'Distance from feared object (e.g., 3 feet vs. 6 feet)',
              'Time of day (e.g., day vs. night)',
              'Focus of attention (looking at feared object vs. looking away/closing eyes)',
              'Environment characteristics (e.g., size, temperature)',
              'Body position (lying down vs. standing vs. sitting)',
              'Pair with imaginal',
              'Amount of time (e.g., to prepare, to swallow food, to give speech)',
              'Vehicle of feared object (e.g., container, bag, exposed)',
            ].map((text, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>{text}</li>
            ))}
          </ul>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HierarchyPage;
