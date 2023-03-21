import React, { useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Toolbar } from '@mui/material';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { getHierarchy, updateHierarchy } from '../Hierarchy/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import { TRow } from './ExposureItemTable';

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
  hierarchies: any[];
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  exposureItems: any[];
  setSelectedRows: React.Dispatch<React.SetStateAction<TRow[]>>;
}

function HierarchyDropdown({
  hierarchies,
  count,
  setCount,
  exposureItems,
  setSelectedRows,
}: HierarchyDropdownProps) {
  const [selectedHierarchies, setSelectedHierarchies] = useState<string[]>([]);
  const user = useAppSelector(selectUser);
  const email = user?.email?.toLowerCase() || '';

  function handleChange(event: SelectChangeEvent<typeof selectedHierarchies>) {
    const {
      target: { value },
    } = event;
    setSelectedHierarchies(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  function addExposuresToHierarchies() {
    // get the ids of the selected hierarchies
    // eslint-disable-next-line prefer-const
    let selectedHierarchyIds: string[] = [];
    hierarchies.forEach((h) => {
      selectedHierarchies.forEach((sh) => {
        if (h.title === sh) {
          selectedHierarchyIds.push(h.id);
        }
      });
    });

    // append exposure items to selected hierarchies
    selectedHierarchyIds.forEach(async (id) => {
      const res = await getHierarchy(email, id);
      const numCurrExposures = res.exposures.length;
      const toAdd: [string, string, string][] = exposureItems.map((e) => [
        e.name,
        (numCurrExposures + exposureItems.indexOf(e)).toString(),
        '',
      ]);
      updateHierarchy(
        email,
        id,
        undefined,
        undefined,
        res.exposures.concat(toAdd),
      );
    });

    // reset all selections
    setSelectedHierarchies([]);
    setCount(0);
    setSelectedRows([]);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'left',
        textAlign: 'left',
        // marginTop: '20px',
      }}
    >
      {/* <Toolbar /> */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p
          style={{
            fontSize: '1.0rem',
            textAlign: 'left',
            width: '80%',
            margin: '10px auto',
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
          <FormControl sx={{ width: 700 }}>
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
              {hierarchies.map((hierarchy) => (
                <MenuItem key={hierarchy.id} value={hierarchy.title}>
                  <Checkbox
                    checked={selectedHierarchies?.indexOf(hierarchy.title) > -1}
                  />
                  <ListItemText primary={hierarchy.title} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <PrimaryButton
            variant="contained"
            size="small"
            sx={{ width: '30%', margin: '0px 10px' }}
            onClick={() => addExposuresToHierarchies()}
          >
            Add ({count}) Items
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export default HierarchyDropdown;
