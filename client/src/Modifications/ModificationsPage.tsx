/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import { Grid } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

const styles = {
  container: {
    display: 'flex',
    'flex-direction': 'column',
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
  },
};

function ModificationsPage() {
  const modifications = [
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
  ];

  return (
    <div style={styles.container}>
      <Toolbar />
      <div>
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
        <p
          style={{
            color: '#7a7a7a',
            fontSize: '16px',
            margin: '0',
            marginBottom: '20px',
          }}
        >
          General/universal modifications that can be made to all exposure items
        </p>
        <ul
          style={{
            fontSize: '16px',
            margin: '0px',
            marginTop: '10px',
            padding: '0px',
          }}
        >
          {modifications.map((text, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
              }}
            >
              <span style={{ marginRight: '6px', fontSize: '18px' }}>›</span>
              <p style={{ margin: '5px 0px' }}>{text}</p>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ModificationsPage;
