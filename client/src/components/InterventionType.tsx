import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { fontFamily } from '@mui/system';

export default function InterventionType() {
  return (
    <FormControl>
      Intervention Type
      <FormGroup>
        <FormControlLabel control={<Checkbox />} label="In vivo" />
        <FormControlLabel control={<Checkbox />} label="Imaginal" />
        <FormControlLabel control={<Checkbox />} label="Interoceptive" />
        <FormControlLabel control={<Checkbox />} label="Psychoeducation" />
        <FormControlLabel control={<Checkbox />} label="Stimulus Control" />
        <FormControlLabel control={<Checkbox />} label="Psychiatric Hospital" />
        <FormControlLabel
          control={<Checkbox />}
          label="Habit Reversal Training"
        />
      </FormGroup>
    </FormControl>
  );
}
