/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-props-no-spreading */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import React, { useState } from 'react';
import {
  Alert,
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Snackbar,
  TextField,
  Toolbar,
} from '@mui/material';
import { ArrowRight } from '@material-ui/icons';
import PrimaryButton from '../components/buttons/PrimaryButton';
import FormCol from '../components/form/FormCol';
import FormRow from '../components/form/FormRow';
import submit from './api';
import masterDisorderObject from './disorders';

const styles = {
  button: {
    margin: '0 auto',
    display: 'block',
    marginTop: '10px',
  },
};

function SubmitResourcePage() {
  const interventionTypes = [
    'In Vivo',
    'Imaginal',
    'Interoceptive',
    'Psychoeducation',
    'Stimulus Control',
    'Psychiatric Hospital',
    'Habit Reversal Training',
  ];
  const formatTypes = [
    'Idea',
    'Audio',
    'Picture',
    'Virtual Reality',
    'Reading',
    'Joke',
    'Script',
  ];
  const maturityTypes = ['Child', 'Adult'];

  const emp: string[] = [];

  const defaultValues = {
    title: '',
    disorder: emp,
    keywords: '',
    modifications: '',
    link: '',
    formats: Object.fromEntries(formatTypes.map((i) => [i, false])),
    interventions: Object.fromEntries(interventionTypes.map((i) => [i, false])),
    maturity: Object.fromEntries(maturityTypes.map((i) => [i, false])),
  };
  const [values, setValueState] = useState(defaultValues);

  const setValue = (field: string, value: any) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };

  const setFormatCheckboxValues = (option: string) => {
    setValueState((prevState) => ({
      ...prevState,
      formats: {
        ...prevState.formats,
        [option]: !prevState.formats[option],
      },
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

  const resolveDisorder = (path: string[]): string[] => {
    let curr = masterDisorderObject;
    path.forEach((ind) => {
      curr = curr[ind];
    });
    return Object.keys(curr);
  };

  const [disordersOpen, setDisordersOpen] = useState(false);
  const [currPath, setCurrPath] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchedDisorders, setSearchedDisorders] = useState<string[]>([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const disorders = resolveDisorder(currPath);

  const submitResource = async () => {
    const formats = Object.keys(values.formats).filter(
      (format) => values.formats[format],
    );
    const interventions = Object.keys(values.interventions).filter(
      (intervention) => values.interventions[intervention],
    );

    const res = await submit(
      values.title,
      values.disorder,
      formats,
      interventions,
      values.maturity.Child,
      values.maturity.Adult,
      [values.keywords],
      values.modifications,
      values.link,
    );
    if (res) {
      setValueState(defaultValues);
      setSuccessOpen(true);
    } else {
      setSuccessOpen(false);
    }
  };

  const getCurrentList = (p: string[], forDisplay = false) => {
    let tempPath: any = p;
    let tempOptions: any = {};
    Object.assign(tempOptions, masterDisorderObject);
    while (tempPath.length > 0) {
      tempOptions = tempOptions[tempPath[0]];
      tempPath = tempPath.slice(1);
    }
    // TODO: figure out why this doesn't truncate number of keywords displayed
    if (tempOptions.Keyword && forDisplay) {
      tempOptions.Keyword = Object.fromEntries(
        Object.entries(tempOptions.Keyword).slice(0, 5),
      );
    }
    return tempOptions;
  };

  const shiftCategory = (event: any, newOption: any) => {
    event.preventDefault();
    event.stopPropagation();
    const newPath = [...currPath, newOption];
    if (resolveDisorder(newPath).length !== 0) {
      setCurrPath(newPath);
    }
  };

  return (
    <div
      style={{
        marginLeft: '100px',
        marginRight: '100px',
      }}
    >
      <Toolbar />
      <h2 style={{ fontSize: '50px', fontWeight: 'bold' }}>
        Submit New Resource
      </h2>
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
            <Autocomplete
              freeSolo
              multiple
              disableCloseOnSelect
              id="combo-box-demo"
              options={inputText === '' ? disorders : searchedDisorders}
              sx={{ width: '100%' }}
              onOpen={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDisordersOpen(!disordersOpen);
                setCurrPath([]);
              }}
              onInputChange={(event, inputValue) => {
                setInputText(inputValue);
                if (inputValue === '') {
                  setCurrPath([]);
                } else {
                  const emp: Object[] = [];
                  const flattenedObj = Object.assign(
                    {},
                    ...(function flatten(o: any): Object[] {
                      return emp.concat(
                        ...Object.keys(o).map((k) => {
                          if (typeof o[k] === 'boolean') {
                            return { [k]: 'temp' };
                          }
                          return [...flatten(o[k]), { [k]: 'temp' }];
                        }),
                      );
                    })(getCurrentList([], false)),
                  );
                  const itemsBelow = Object.keys(flattenedObj);
                  setSearchedDisorders(
                    itemsBelow.filter(
                      (it) =>
                        it.toLowerCase().indexOf(inputValue.toLowerCase()) !==
                        -1,
                    ),
                  );
                }
              }}
              renderOption={(props, option, { selected }) =>
                inputText === '' ? (
                  resolveDisorder([...currPath, option]).length !== 0 ? (
                    <li
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <li
                        {...props}
                        style={{
                          maxWidth: 'fit-content',
                          padding: 0,
                          display: 'inline-block',
                        }}
                      >
                        <Checkbox checked={selected} />
                      </li>
                      <button
                        type="button"
                        style={{
                          display: 'inline-block',
                          margin: 0,
                          background: 'none',
                          color: 'inherit',
                          border: 'none',
                          padding: 0,
                          font: 'inherit',
                          cursor: 'pointer',
                          outline: 'inherit',
                          width: '100%',
                        }}
                        onClick={(e) => shiftCategory(e, option)}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          {option}
                          <ArrowRight
                            style={{
                              width: 25,
                              height: 25,
                            }}
                          />
                        </div>
                      </button>
                    </li>
                  ) : (
                    <li
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <li
                        {...props}
                        style={{
                          maxWidth: 'fit-content',
                          padding: 0,
                          display: 'inline-block',
                        }}
                      >
                        <Checkbox checked={selected} />
                      </li>
                      <button
                        type="button"
                        style={{
                          display: 'inline-block',
                          margin: 0,
                          background: 'none',
                          color: 'inherit',
                          border: 'none',
                          padding: 0,
                          font: 'inherit',
                          cursor: 'pointer',
                          outline: 'inherit',
                          width: '100%',
                          textAlign: 'left',
                        }}
                      >
                        {option}
                      </button>
                    </li>
                  )
                ) : (
                  <li
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <li
                      {...props}
                      style={{
                        maxWidth: 'fit-content',
                        padding: 0,
                        display: 'inline-block',
                      }}
                    >
                      <Checkbox checked={selected} />
                    </li>
                    <button
                      type="button"
                      style={{
                        display: 'inline-block',
                        margin: 0,
                        background: 'none',
                        color: 'inherit',
                        border: 'none',
                        padding: 0,
                        font: 'inherit',
                        cursor: 'pointer',
                        outline: 'inherit',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      {option}
                    </button>
                  </li>
                )
              }
              renderInput={(params) => (
                <TextField {...params} label="Disorders" />
              )}
            />
          </Grid>
        </FormRow>
        <FormRow>
          <Grid item width="0.5">
            <FormControl sx={{ 'padding-left': 20 }}>
              Formats
              <FormGroup>
                {formatTypes.map((option) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.formats[option]}
                        onChange={() => setFormatCheckboxValues(option)}
                        name={option}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
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
                          setInterventionCheckboxValues(option, e.target.value)
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
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity={successOpen ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {successOpen
            ? 'Successfully submitted resource!'
            : 'Error - please try again'}
        </Alert>
      </Snackbar>
      <PrimaryButton style={styles.button} onClick={() => submitResource()}>
        Submit
      </PrimaryButton>
    </div>
  );
}

export default SubmitResourcePage;
