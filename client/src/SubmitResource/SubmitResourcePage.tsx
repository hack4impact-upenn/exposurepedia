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
  const interventionTypes = [
    'In vivo',
    'Imaginal',
    'Interoceptive',
    'Psychoeducation',
    'Stimulus Control',
    'Psychiatric Hospital',
    'Habit Reversal Training',
  ];
  const maturityTypes = ['Child', 'Adult'];

  const defaultValues = {
    title: '',
    disorder: '',
    keywords: '',
    modifications: '',
    link: '',
    format: '',
    interventions: Object.fromEntries(interventionTypes.map((i) => [i, false])),
    maturity: Object.fromEntries(maturityTypes.map((i) => [i, false])),
  };
  const [values, setValueState] = useState(defaultValues);

  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };

  const setInterventionCheckboxValues = (option: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      interventions: {
        ...prevState.interventions,
        [option]: !prevState.interventions[option],
      },
    }));
  };

  const setMaturityCheckboxValues = (option: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      maturity: {
        ...prevState.maturity,
        [option]: !prevState.maturity[option],
      },
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
          <FormRow>
            <Grid item width="0.5">
              <FormControl>
                Format
                <RadioGroup
                  aria-labelledby="format"
                  defaultValue="idea"
                  name="radio-buttons-group"
                  value={values.format || ''}
                  onChange={(e) => setValue('format', e.target.value)}
                >
                  <FormControlLabel
                    value="idea"
                    control={<Radio />}
                    label="Idea"
                  />
                  <FormControlLabel
                    value="audio"
                    control={<Radio />}
                    label="Audio"
                  />
                  <FormControlLabel
                    value="picture"
                    control={<Radio />}
                    label="Picture"
                  />
                  <FormControlLabel
                    value="vr"
                    control={<Radio />}
                    label="Virtual Reality"
                  />
                  <FormControlLabel
                    value="reading"
                    control={<Radio />}
                    label="Reading"
                  />
                  <FormControlLabel
                    value="joke"
                    control={<Radio />}
                    label="Joke"
                  />
                  <FormControlLabel
                    value="script"
                    control={<Radio />}
                    label="Script"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item width="0.5">
              <FormControl>
                Intervention Type
                <FormGroup>
                  {interventionTypes.map((option) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.interventions[option]}
                          onChange={(e) =>
                            setInterventionCheckboxValues(
                              option,
                              e.target.value,
                            )
                          }
                          name={option}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item width="1">
              <FormControl>
                Maturity:
                <FormGroup>
                  {maturityTypes.map((option) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.maturity[option]}
                          onChange={(e) =>
                            setMaturityCheckboxValues(option, e.target.value)
                          }
                          name={option}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item width="1">
              <TextField
                fullWidth
                size="small"
                type="text"
                label="Keywords (optional)"
                value={values.keywords}
                onChange={(e) => setValue('keywords', e.target.value)}
              />
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item width="1">
              <TextField
                fullWidth
                multiline
                type="text"
                label="Modifications (optional)"
                rows={4}
                value={values.modifications}
                onChange={(e) => setValue('modifications', e.target.value)}
              />
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item width="1">
              <TextField
                fullWidth
                size="small"
                type="text"
                label="Link to Resource (optional)"
                value={values.link}
                onChange={(e) => setValue('link', e.target.value)}
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
