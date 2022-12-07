import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import PrimaryButton from '../components/buttons/PrimaryButton';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface HierarchyDropdownProps {
  hierarchies: string[];
  count: number;
}

function HierarchyDropdown({ hierarchies, count }: HierarchyDropdownProps) {
  const [selectedHierarchies, setSelectedHierarchies] = React.useState<
    string[]
  >([]);

  function handleChange(event: SelectChangeEvent<typeof selectedHierarchies>) {
    const {
      target: { value },
    } = event;
    setSelectedHierarchies(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'left',
        textAlign: 'left',
      }}
    >
      <p
        style={{
          fontSize: '1.0rem',
          textAlign: 'left',
          width: '80%',
          margin: '0px auto',
          padding: '0px',
        }}
      >
        Check exposure items to add them to a hierarchy.
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80%',
          margin: '10px auto',
        }}
      >
        <FormControl sx={{ m: 1, width: 700 }}>
          <InputLabel size="small" id="demo-multiple-checkbox-label">
            Select Hierarchies
          </InputLabel>
          <Select
            size="small"
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedHierarchies}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={handleChange}
            input={<OutlinedInput label="Select Hierarchies" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {hierarchies.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={selectedHierarchies.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <PrimaryButton variant="contained" size="small" sx={{ width: '30%' }}>
          Add ({count}) Items
        </PrimaryButton>
      </div>
    </div>
  );
}

export default HierarchyDropdown;
