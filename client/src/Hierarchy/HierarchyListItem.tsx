import React from 'react';
import { useNavigate } from 'react-router-dom';
import InvertedPrimaryButton from '../components/buttons/InvertedPrimaryButton';

interface HierarchyListItemProps {
  id: string;
  name: string;
  date: string;
  index: number;
}

const styles = {
  container: {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'rgb(112, 112, 112)',
    borderRadius: '20px',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    fontFamily: 'Roboto',
    marginBottom: '20px',
    alignItems: 'center',
  },
  containerLeft: {
    display: 'flex',
    'flex-direction': 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginRight: 40,
  },
  header: {
    fontSize: '20px',
    padding: '0',
    margin: '0',
  },
  subheader: {
    fontSize: '29px',
    color: '#C7BDBD',
    width: '40%',
    textAlign: 'center',
  },
  containerRight: {
    justifyContent: 'space-around',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    marginRight: '20px',
  },
  description: {
    padding: 0,
    margin: 0,
  },
  button: {
    padding: '5px 20px',
  },
  date: {
    color: 'gray',
    fontSize: '16px',
    padding: '0',
    margin: '0',
  },
  index: {
    fontSize: '20px',
    padding: '0',
    margin: '0',
    marginRight: '8px',
  },
  title: {
    display: 'flex',
    'flex-direction': 'row',
    alignItems: 'flex-start',
    padding: '12px 20px',
  },
};

function HierarchyListItem(props: HierarchyListItemProps) {
  const { id, name, date, index } = props;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/viewhierarchy', {
      state: {
        id,
      },
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <p style={styles.index}>{index + 1}</p>
        <div style={styles.containerLeft}>
          <p style={styles.header}>{name}</p>
          <p style={styles.date}>{date}</p>
        </div>
      </div>
      <div style={styles.containerRight}>
        <InvertedPrimaryButton
          variant="outlined"
          style={styles.button}
          onClick={() => handleNavigate()}
        >
          Open
        </InvertedPrimaryButton>
      </div>
    </div>
  );
}

export default HierarchyListItem;
