/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import { Button } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import HierarchyListItem from '../components/HierarchyListItem';

import { useData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';

const styles = {
  button: {
    padding: '8px 15px',
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

  const hierarchies = useData('hierarchy/635af65babcb6dabb12ed65e');

  console.log(hierarchies);

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
      <Toolbar />
      <div style={{ width: '100%' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold' }}>Hierarchies</h1>
      </div>
      {hierarchies?.data?.map((hierarchy_: HierarchyListItem) => (
        <HierarchyListItem
          key={hierarchy_.title}
          index={hierarchies?.data.indexOf(hierarchy_)}
          title={hierarchy_.title}
          updatedAt={hierarchy_.updated_at}
          id={hierarchy_.id}
        />
      ))}

      <Button variant="contained" style={styles.button}>
        Add New Hierarchy
      </Button>
    </div>
  );
}

export default HierarchyPage;
