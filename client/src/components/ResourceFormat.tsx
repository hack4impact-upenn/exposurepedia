import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function ResourceFormat() {
  return (
    <FormControl>
      Format
      <RadioGroup
        aria-labelledby="format"
        defaultValue="idea"
        name="radio-buttons-group"
      >
        <FormControlLabel value="idea" control={<Radio />} label="Idea" />
        <FormControlLabel value="audio" control={<Radio />} label="Audio" />
        <FormControlLabel value="picture" control={<Radio />} label="Picture" />
        <FormControlLabel
          value="vr"
          control={<Radio />}
          label="Virtual Reality"
        />
        <FormControlLabel value="reading" control={<Radio />} label="Reading" />
        <FormControlLabel value="joke" control={<Radio />} label="Joke" />
        <FormControlLabel value="script" control={<Radio />} label="Script" />
      </RadioGroup>
    </FormControl>
  );
}
