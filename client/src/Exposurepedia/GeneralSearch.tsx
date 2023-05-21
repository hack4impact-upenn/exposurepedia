import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import React from 'react';

interface SearchProps {
  name: string;
  search: string;
  handleChange: (value: string) => void;
}

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row' as const,
    width: '100%',
    justifyContent: 'center',
    margin: '10px 0px',
    padding: '0px 10px',
  },
  button: {
    textTransform: 'none',
    height: 'px',
    borderRadius: '6px',
    marginLeft: '4px',
  },
};

function GeneralSearch({ name, search, handleChange }: SearchProps) {
  return (
    <div style={styles.row}>
      <TextField
        style={{ width: '80%' }}
        placeholder={`Search ${name}`}
        variant="outlined"
        size="small"
        InputProps={{
          style: {
            height: '45px',
            marginRight: '4px',
            width: '100%',
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={search}
        onChange={(event) => handleChange(event.target.value)}
      />
      <div style={{ width: '.5%' }} />
    </div>
  );
}

export default GeneralSearch;
