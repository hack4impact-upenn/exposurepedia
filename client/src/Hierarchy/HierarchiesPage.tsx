/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import PrimaryButton from '../components/buttons/PrimaryButton';
import HierarchyListItem from '../components/HierarchyListItem';

const styles = {
  button: {
    marginTop: '10px',
    marginBottom: '10px',
    marginleft: '5px',
  },
};

const hierarchyList: any[] = [
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
        justifyContent: 'left',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: '100px',
      }}
    >
      <h1 style={{ fontSize: '50px', fontWeight: 'bold' }}>Hierarchies</h1>

      {hierarchyList.map((hierarchy_) => (
        <HierarchyListItem
          key={hierarchy_.name}
          index={hierarchyList.indexOf(hierarchy_)}
          name={hierarchy_.name}
          date={hierarchy_.date}
        />
      ))}

      <PrimaryButton style={styles.button}>Add New Hierarchy</PrimaryButton>
    </div>
  );
}

export default HierarchyPage;
