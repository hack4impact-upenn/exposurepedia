/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import { Button } from '@mui/material';
import HierarchyListItem from '../components/HierarchyListItem';

const styles = {
  button: {
    padding: '8px 15px',
  },
};

const hierarchyList = [
  { name: 'ABC Disorder', date: '2021-01-01' },
  { name: 'XYZ Disorder', date: '2021-01-01' },
  { name: 'DEF Disorder', date: '2021-01-01' },
  { name: 'GHI Disorder', date: '2021-01-01' },
  { name: 'JKL Disorder', date: '2021-01-01' },
  { name: 'MNO Disorder', date: '2021-01-01' },
];

function HierarchyPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '60%',
        margin: 'auto',
      }}
    >
      <div style={{ width: '100%' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold' }}>Hierarchies</h1>
      </div>
      {hierarchyList.map((hierarchy_) => (
        <HierarchyListItem
          key={hierarchy_.name}
          index={hierarchyList.indexOf(hierarchy_)}
          name={hierarchy_.name}
          date={hierarchy_.date}
        />
      ))}

      <Button variant="contained" style={styles.button}>
        Add New Hierarchy
      </Button>
    </div>
  );
}

export default HierarchyPage;
