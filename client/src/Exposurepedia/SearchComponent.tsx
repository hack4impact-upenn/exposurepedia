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
    alignItems: 'left',
    flexDirection: 'row' as const,
    width: '100%',
    justifyContent: 'center',
    margin: '0px 0px',
    padding: '0px 0px',
  },
};

function SearchComponent({ name, search, handleChange }: SearchProps) {
  return (
    <div style={styles.row}>
      <TextField
        sx={{ width: '100%' }}
        placeholder={`Search ${name}`}
        variant="outlined"
        size="small"
        InputProps={{
          style: {
            height: '35px',
            margin: 'auto',
            width: '90%',
            marginBottom: '10px',
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
    </div>
  );
}

export default SearchComponent;
