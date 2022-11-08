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
  Autocomplete,
} from '@mui/material';
import PrimaryButton from '../components/buttons/PrimaryButton';
import FormCol from '../components/form/FormCol';
import FormRow from '../components/form/FormRow';

const styles = {
  button: {
    margin: '0 auto',
    display: 'block',
    marginTop: '10px',
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
  const [disorders, setDisorderState] = useState<string[]>(defaultDisorders);

  const [disordersOpen, setDisordersOpen] = useState(false);

  const [currLayer, setCurrLayer] = useState(0);

  const masterDisorderObject: any = {
    'Body Dysmorphia': [],
    'Generalized Anxiety': [],
    'Health Anxiety/Medical Phobia': [
      'Blood/Injection/Injury',
      'Dental Phobia',
    ],
    Hoarding: [],
    'Obsessive Compulsive Disorder (OCD)': [
      'Aggressive/Violent',
      'Checking',
      'Contamination',
      'Existential',
      'Fear of Acting on Unwanted Impulses',
      'Fear of Being Cancelled',
      'Fear of Being Misunderstood',
      'Fear of Contracting Sexually-Transmitted Diseases/HIV/AIDs',
      'Fear of Developing Other Types of OCD',
      'Fear of Forgetting',
      'Fear of Getting in Trouble',
      'Fear of Going Crazy',
      'Fear of Making the Wrong Decision',
      'Fear of Unintentionally Causing Harm',
      'Magical Numbers',
      'Need to Know',
      'Not Just Right',
      'Perfectionism',
      'Relationship OCD',
      'Scrupulosity/Morality',
      'Sexual/Gender',
      'Somatic OCD',
      'Symmetry/Ordering',
      'Fear of Uncertainty',
    ],
    'Panic/Agoraphobia': [],
    'Specific Phobia': [
      'Animals',
      'Claustriphobia',
      'Choking',
      'Dark',
      'Driving',
      'Flying',
      'Heights',
      'Storms/Natural Disasters',
      'Trypophobia',
      'Vomit (Emetophobia)',
    ],
    'Posttraumatic Stress Disorder (PTSD)': [
      'Combat/Military/Terrorism',
      'Sexual Assault',
      'Car Accident',
    ],
    'Separation Anxiety': [],
    'Social Anxiety': [],
    'Trichotillomania/Excoriation': [],
  };

  const disordersLayer2: any = {
    'Blood/Injection/Injury': [],
    'Dental Phobia': [],
    'Aggressive/Violent': [
      'Fear of Being a Sociopath/Murderer',
      'Fear of a Hit-and-Run',
      'Fear of Self-Harm',
    ],
    Checking: [],
    Contamination: [],
    Existential: ['Fear of Wasting Time'],
    'Fear of Acting on Unwanted Impulses': [],
    'Fear of Being Cancelled': [],
    'Fear of Being Misunderstood': [],
    'Fear of Contracting Sexually-Transmitted Diseases/HIV/AIDs': [],
    'Fear of Developing Other Types of OCD': [],
    'Fear of Forgetting': [],
    'Fear of Getting in Trouble': [],
    'Fear of Going Crazy': [],
    'Fear of Making the Wrong Decision': ['Fear of Buying the Wrong Thing'],
    'Fear of Unintentionally Causing Harm': [],
    'Magical Numbers': [],
    'Need to Know': [],
    'Not Just Right': [],
    Perfectionism: [],
    'Relationship OCD': ['Retractive Jealousy'],
    'Scrupulosity/Morality': ['Fear of Being Racist', 'Fear of Sinning'],
    'Sexual/Gender': [
      'Fear of Being Gay/Straight',
      'Fear of Being Trans',
      'Fear of Being a Pedophile',
    ],
    'Somatic OCD': [],
    'Symmetry/Ordering': [],
    'Fear of Uncertainty': [],
    Animals: [
      'Birds',
      'Bugs',
      'Cats',
      'Dogs',
      'Fish',
      'Mice/Rats',
      'Sharks',
      'Snakes',
    ],
    Claustriphobia: [],
    Choking: [],
    Dark: [],
    Driving: [],
    Flying: [],
    Heights: [],
    'Storms/Natural Disasters': [],
    Trypophobia: [],
    'Vomit (Emetophobia)': [],
    'Combat/Military/Terrorism': [],
    'Sexual Assault': [],
    'Car Accident': [],
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
              open={disordersOpen}
              id="combo-box-demo"
              options={disorders}
              sx={{ width: '100%' }}
              onFocus={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDisordersOpen(!disordersOpen);
                setDisorderState(defaultDisorders);
                setCurrLayer(0);
              }}
              onChange={(event, value) => {
                event.preventDefault();
                event.stopPropagation();
                if (value) {
                  if (currLayer === 0) {
                    setDisorderState(masterDisorderObject[value]);
                    setCurrLayer(1);
                    console.log('new disorders: ', disorders);
                  } else if (currLayer === 1) {
                    setDisorderState(disordersLayer2[value]);
                    setCurrLayer(2);
                    console.log('new disorders: ', disorders);
                  } else {
                    setValue('disorder', value);
                    setDisordersOpen(!disordersOpen);
                    setCurrLayer(0);
                  }
                }
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

      <PrimaryButton style={styles.button}>Submit</PrimaryButton>
      {/* </div> */}
    </div>
  );
}

export default SubmitResourcePage;
