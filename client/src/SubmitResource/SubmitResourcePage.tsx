/* eslint-disable react/react-in-jsx-scope */

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */
import React, { useEffect, useState } from 'react';
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
  Autocomplete,
  Toolbar,
} from '@mui/material';
import PrimaryButton from '../components/buttons/PrimaryButton';
import FormCol from '../components/form/FormCol';
import FormRow from '../components/form/FormRow';
import submit from './api';

const styles = {
  button: {
    margin: '0 auto',
    display: 'block',
    marginTop: '10px',
  },
};

interface DisorderTree {
  [key: string]: DisorderTree;
}

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
    const temp = values.disorder;
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };

  const setFormatCheckboxValues = (option: string, value: string) => {
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

  const defaultDisorders = [
    'Body Dysmorphia',
    'Generalized Anxiety',
    'Health Anxiety/Medical Phobia',
    'Hoarding',
    'Obsessive Compulsive Disorder (OCD)',
    'Panic/Agoraphobia',
    'Specific Phobia',
    'Posttraumatic Stress Disorder (PTSD)',
    'Separation Anxiety',
    'Social Anxiety',
    'Trichotillomania/Excoriation',
  ];

  const masterDisorderObject: DisorderTree = {
    'Body Dysmorphia': {},
    'Generalized Anxiety': {},
    'Health Anxiety/Medical Phobia': {
      'Blood/Injection/Injury': {},
      'Dental Phobia': {},
    },
    Hoarding: {},
    'Obsessive Compulsive Disorder (OCD)': {
      'Aggressive/Violent': {
        'Fear of Being a Sociopath/Murderer': {},
        'Fear of a Hit-and-Run': {},
        'Fear of Self-Harm': {},
      },
      Checking: {},
      Contamination: {},
      Existential: {
        'Fear of Wasting Time': {},
      },
      'Fear of Acting on Unwanted Impulses': {},
      'Fear of Being Cancelled': {},
      'Fear of Being Misunderstood': {},
      'Fear of Contracting Sexually-Transmitted Diseases/HIV/AIDs': {},
      'Fear of Developing Other Types of OCD': {},
      'Fear of Forgetting': {},
      'Fear of Getting in Trouble': {},
      'Fear of Going Crazy': {},
      'Fear of Making the Wrong Decision': {
        'Fear of Buying the Wrong Thing': {},
      },
      'Fear of Unintentionally Causing Harm': {},
      'Magical Numbers': {},
      'Need to Know': {},
      'Not Just Right': {},
      Perfectionism: {},
      'Relationship OCD': {
        'Retractive Jealousy': {},
      },
      'Scrupulosity/Morality': {
        'Fear of Being Racist': {},
        'Fear of Sinning': {},
      },
      'Sexual/Gender': {
        'Fear of Being Gay/Straight': {},
        'Fear of Being Trans': {},
        'Fear of Being a Pedophile': {},
      },
      'Somatic OCD': {},
      'Symmetry/Ordering': {},
      'Fear of Uncertainty': {},
    },
    'Panic/Agoraphobia': {},
    'Specific Phobia': {
      Animals: {
        Birds: {},
        Bugs: {},
        Cats: {},
        Dogs: {},
        Fish: {},
        'Mice/Rats': {},
        Sharks: {},
        Snakes: {},
      },
      Claustriphobia: {},
      Choking: {},
      Dark: {},
      Driving: {},
      Flying: {},
      Heights: {},
      'Storms/Natural Disasters': {},
      Trypophobia: {},
      'Vomit (Emetophobia)': {},
    },
    'Posttraumatic Stress Disorder (PTSD)': {
      'Combat/Military/Terrorism': {},
      'Sexual Assault': {},
      'Car Accident': {},
    },
    'Separation Anxiety': {},
    'Social Anxiety': {},
    'Trichotillomania/Excoriation': {},
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
  // const [disorders, setDisorderState] = useState<string[]>(defaultDisorders);
  // useEffect(() => {
  //   setDisorderState(resolveDisorder(currPath));
  // }, [currPath, resolveDisorder]);

  const disorders = resolveDisorder(currPath);

  const submitResource = () => {
    const formats = Object.keys(values.formats).filter(
      (format) => values.formats[format],
    );
    const interventions = Object.keys(values.interventions).filter(
      (intervention) => values.interventions[intervention],
    );

    submit(
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
      {/* <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          overflowY: 'scroll',
          alignItems: 'center',
          marginLeft: '100px',
          marginRight: '100px',
        }}
      > */}
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
            {/* <TextField
              fullWidth
              size="small"
              type="text"
              required
              label="Disorder"
              value={values.disorder}
              onChange={(e) => setValue('disorder', e.target.value)}
            /> */}
            <Autocomplete
              multiple
              // open={disordersOpen}
              disableCloseOnSelect
              id="combo-box-demo"
              options={disorders}
              sx={{ width: '100%' }}
              onFocus={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDisordersOpen(!disordersOpen);
                setCurrPath([]);
              }}
              onChange={(event, value, reason) => {
                event.preventDefault();
                event.stopPropagation();
                let newPath: string[] = [];
                if (reason === 'selectOption') {
                  const newOption: string = value[value.length - 1];
                  newPath = [...currPath, newOption];
                } else if (reason === 'removeOption') {
                  newPath = currPath.slice(0, -1);
                }
                if (resolveDisorder(newPath).length === 0) {
                  newPath = [];
                }
                setCurrPath(newPath);
              }}
              renderInput={(params) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
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
                        onChange={(e) =>
                          setFormatCheckboxValues(option, e.target.value)
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
      {/* onSubmit={() => submitResource()} */}
      <PrimaryButton style={styles.button} onClick={() => submitResource()}>
        Submit
      </PrimaryButton>
      {/* </div> */}
    </div>
  );
}

export default SubmitResourcePage;
