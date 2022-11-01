/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import React, { useState } from 'react';
import {
  Link,
  TextField,
  Grid,
  Typography,
  FormLabel,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  FormGroup,
} from '@mui/material';
import PrimaryButton from '../components/buttons/PrimaryButton';
import FormCol from '../components/form/FormCol';
import FormRow from '../components/form/FormRow';

const styles = {
  button: {
    marginTop: '10px',
    marginBottom: '10px',
    marginleft: '5px',
  },
};

function SubmitResourcePage() {
  const defaultValues = {
    title: '',
    disorder: '',
  };
  const [values, setValueState] = useState(defaultValues);

  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };

  return (
    <div
      style={{
        marginLeft: '100px',
        marginRight: '100px',
      }}
    >
      <h2 style={{ fontSize: '50px', fontWeight: 'bold' }}>
        Submit New Resource
      </h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          overflowY: 'scroll',
          alignItems: 'center',
          marginLeft: '100px',
          marginRight: '100px',
        }}
      >
        <FormCol>
          <FormRow>
            <Grid item width="1">
              <TextField
                fullWidth
                size="small"
                type="text"
                required
                label="Title"
                value={values.title}
                onChange={(e) => setValue('title', e.target.value)}
              />
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item width="1">
              <TextField
                fullWidth
                size="small"
                type="text"
                required
                label="Disorder"
                value={values.disorder}
                onChange={(e) => setValue('disorder', e.target.value)}
              />
            </Grid>
          </FormRow>
        </FormCol>

        <PrimaryButton style={styles.button}>Submit</PrimaryButton>
      </div>
    </div>
  );
}

export default SubmitResourcePage;
