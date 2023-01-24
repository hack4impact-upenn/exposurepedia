import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment, Button } from '@mui/material';
import React, { useState } from 'react';

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
    height: '30px',
    borderRadius: '6px',
    marginLeft: '4px',
  },
};

function SearchComponent({ name, search, handleChange }: SearchProps) {
  return (
    <div style={styles.row}>
      <TextField
        placeholder={`Search ${name}`}
        variant="outlined"
        size="small"
        InputProps={{
          style: {
            height: '35px',
            marginRight: '4px',
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
      <Button variant="contained" sx={styles.button}>
        Search
      </Button>
    </div>
  );
}

export default SearchComponent;
