import React from 'react';
import InvertedPrimaryButton from './buttons/InvertedPrimaryButton';
import PrimaryButton from './buttons/PrimaryButton';

interface HierarchyListItemProps {
    name: string;
    date: string;
    index: number;
  }

  const styles = {
    container: {
      borderStyle: 'solid',
      borderWidth: '3px',
      borderColor: 'black',
      borderRadius: '20px',
      height: '83px',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'Roboto',
      marginBottom: '20px',
    },
    containerLeft: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginRight: 40,
    },
    header: {
      marginLeft: '20px',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    subheader: {
      fontSize: '29px',
      color: '#C7BDBD',
      width: '40%',
      textAlign: 'center',
    },
    containerMiddle: {},
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
        marginTop: '15px',
        marginBottom: '10px',
        marginleft: '5px',
    }
  };

function HierarchyListItem (props: HierarchyListItemProps) {
    const { name, date, index } = props;
    const total = "Hierarchy ".concat(index.toString(), ": ", name,  " - ", date);

  return (
   
      <div style={styles.container}>
        <div style={styles.containerLeft}>
          <p style={styles.header}>{total}</p>
        </div>
        <div style={styles.containerMiddle}/>
        <div style={styles.containerRight}>
          <p style={styles.description}>
            
        <InvertedPrimaryButton variant="outlined" style={styles.button}>Open</InvertedPrimaryButton>
          </p>
        </div>
      </div>
  );
};

export default HierarchyListItem;
