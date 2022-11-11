import React from 'react';
import InvertedPrimaryButton from './buttons/InvertedPrimaryButton';

interface HierarchyListItemProps {
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
    width: '90%',
    justifyContent: 'space-between',
    fontFamily: 'Roboto',
    marginBottom: '20px',
    alignItems: 'center',
  },
  containerLeft: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginRight: 40,
  },
  header: {
    marginLeft: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
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
};

function HierarchyListItem(props: HierarchyListItemProps) {
  const { name, date, index } = props;
  const total = 'Hierarchy '.concat(index.toString(), ': ', name, ' - ', date);

  return (
    <div style={styles.container}>
      <div style={styles.containerLeft}>
        <p style={styles.header}>{total}</p>
      </div>
      <div style={styles.containerRight}>
        <InvertedPrimaryButton variant="outlined" style={styles.button}>
          Open
        </InvertedPrimaryButton>
      </div>
    </div>
  );
}

export default HierarchyListItem;
