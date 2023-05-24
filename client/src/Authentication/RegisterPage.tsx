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
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import FormCol from '../components/form/FormCol';
import {
  emailRegex,
  InputErrorMessage,
  nameRegex,
  passwordRegex,
} from '../util/inputvalidation';
import { register } from './api';
import AlertDialog from '../components/AlertDialog';
import PrimaryButton from '../components/buttons/PrimaryButton';
import ScreenGrid from '../components/ScreenGrid';
import FormRow from '../components/form/FormRow';
import FormGrid from '../components/form/FormGrid';

/**
 * A page users visit to be able to register for a new account by inputting
 * fields such as their name, email, and password.
 */
function RegisterPage() {
  const navigate = useNavigate();
  const professionOptions = [
    'Clinical Psycologist',
    'Social Worker / Therapist',
    'Student / Trainee',
    'School Counselor',
    'Psychiatrist',
    'Psychiatric Nurse',
    'Behavior Technician',
    'Other',
  ];
  const settingsOptions = [
    'Private practice',
    'Academic medical center',
    'Community mental health',
    'Student counseling center',
    'Veterans Affairs (VA)',
    'Psychaitric Hosptital',
    'Other',
  ];

  // Default values for state
  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isProfessional: '',
    profession: '',
    degree: '',
    professionOther: '',
    settings: Object.fromEntries(settingsOptions.map((i) => [i, false])),
    settingOther: '',
    percentCaseload: '',
    difficulty: '',
  };
  const defaultShowErrors = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    isProfessional: false,
    profession: false,
    degree: false,
    professionOther: false,
    settings: false,
    settingOther: false,
    percentCaseload: false,
    difficulty: false,
    alert: false,
    signed: false,
  };
  const defaultErrorMessages = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isProfessional: '',
    profession: '',
    degree: '',
    professionOther: '',
    settings: '',
    settingOther: '',
    percentCaseload: '',
    difficulty: '',
    alert: '',
    signed: '',
  };
  type ValueType = keyof typeof values;

  // State values and hooks
  const [values, setValueState] = useState(defaultValues);
  const [signed, setSigned] = useState(false);
  const [showError, setShowErrorState] = useState(defaultShowErrors);
  const [errorMessage, setErrorMessageState] = useState(defaultErrorMessages);
  const [alertTitle, setAlertTitle] = useState('Error');
  const [isRegistered, setRegistered] = useState(false);

  // Helper functions for changing only one field in a state object
  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };
  const setShowError = (field: string, show: boolean) => {
    setShowErrorState((prevState) => ({
      ...prevState,
      ...{ [field]: show },
    }));
  };
  const setErrorMessage = (field: string, msg: string) => {
    setErrorMessageState((prevState) => ({
      ...prevState,
      ...{ [field]: msg },
    }));
  };
  const setCheckboxValues = (option: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      settings: {
        ...prevState.settings,
        [option]: !prevState.settings[option],
      },
    }));
  };

  const getSettingArray = () => {
    const settings = [];
    Object.keys(values.settings).forEach((key) => {
      if (key !== 'Other' && values.settings[key]) {
        settings.push(key);
      }
    });
    if (values.settings.Other) {
      settings.push(values.settingOther);
    }
    return settings;
  };

  const handleAlertClose = () => {
    if (isRegistered) {
      navigate('/login');
    }
    setShowError('alert', false);
  };

  const clearErrorMessages = () => {
    setShowErrorState(defaultShowErrors);
    setErrorMessageState(defaultErrorMessages);
  };

  const validateInputs = () => {
    clearErrorMessages();
    let isValid = true;
    const optionalInputs = ['degree', 'professionOther', 'settingOther'];

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const valueTypeString in values) {
      const valueType = valueTypeString as ValueType;
      if (!values[valueType] && !optionalInputs.includes(valueType)) {
        setErrorMessage(valueTypeString, InputErrorMessage.MISSING_INPUT);
        setShowError(valueTypeString, true);
        isValid = false;
      }
    }

    if (!values.firstName.match(nameRegex)) {
      setErrorMessage('firstName', InputErrorMessage.INVALID_NAME);
      setShowError('firstName', true);
      isValid = false;
    }
    if (!values.lastName.match(nameRegex)) {
      setErrorMessage('lastName', InputErrorMessage.INVALID_NAME);
      setShowError('lastName', true);
      isValid = false;
    }
    if (!values.email.match(emailRegex)) {
      setErrorMessage('email', InputErrorMessage.INVALID_EMAIL);
      setShowError('email', true);
      isValid = false;
    }
    if (!values.password.match(passwordRegex)) {
      setErrorMessage('password', InputErrorMessage.INVALID_PASSWORD);
      setShowError('password', true);
      isValid = false;
    }
    if (!(values.confirmPassword === values.password)) {
      setErrorMessage('confirmPassword', InputErrorMessage.PASSWORD_MISMATCH);
      setShowError('confirmPassword', true);
      isValid = false;
    }
    if (!values.isProfessional) {
      setErrorMessage('isProfessional', InputErrorMessage.FIELD_NOT_SELECTED);
      setShowError('isProfessional', true);
      isValid = false;
    }
    if (!values.profession) {
      setErrorMessage('profession', InputErrorMessage.FIELD_NOT_SELECTED);
      setShowError('profession', true);
      isValid = false;
    }
    if (values.profession === 'Student / Trainee' && !values.degree) {
      setErrorMessage('profession', InputErrorMessage.FIELD_NOT_SELECTED);
      setShowError('profession', true);
      isValid = false;
    }
    if (!Object.values(values.settings).some((checked) => checked)) {
      setErrorMessage('settings', InputErrorMessage.FIELD_NOT_SELECTED);
      setShowError('settings', true);
      isValid = false;
    }
    if (values.settings.Other && !values.settingOther) {
      setErrorMessage('settingOther', InputErrorMessage.MISSING_INPUT);
      setShowError('settingOther', true);
      isValid = false;
    }
    if (!signed) {
      setErrorMessage('signed', InputErrorMessage.MISSING_INPUT);
      setShowError('signed', true);
      isValid = false;
    }

    const percentCaseloadNum = parseInt(values.percentCaseload, 10);
    if (
      Number.isNaN(percentCaseloadNum) ||
      percentCaseloadNum < 0 ||
      percentCaseloadNum > 100
    ) {
      setErrorMessage('percentCaseload', InputErrorMessage.INVALID_NUMERIC);
      setShowError('percentCaseload', true);
      isValid = false;
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateInputs()) {
      const profession: string =
        values.profession === 'Other'
          ? values.professionOther
          : values.profession;

      const degree: string =
        values.profession === 'Student / Trainee' ? values.degree : '';

      register(
        values.firstName,
        values.lastName,
        values.email,
        values.password,
        values.isProfessional,
        profession,
        degree,
        getSettingArray(),
        parseInt(values.percentCaseload, 10),
        parseInt(values.difficulty, 10),
      )
        .then(() => {
          setShowError('alert', true);
          setAlertTitle('');
          setRegistered(true);
          setErrorMessage(
            'alert',
            'Registration is pending admin approval! Wait for an email confirmation.',
          );
        })
        .catch((e) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  }

  const title = "Let's get started";
  return (
    <Grid
      container
      xs={12}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Grid
        item
        container
        direction="column"
        rowSpacing={3}
        xs={8}
        sm={6}
        fontSize="0.75em"
      >
        <FormCol>
          <Grid item container justifyContent="center" spacing={0}>
            <Typography variant="h2">{title}</Typography>
          </Grid>
          <FormRow>
            <Grid item width=".5">
              <TextField
                fullWidth
                error={showError.firstName}
                helperText={errorMessage.firstName}
                size="small"
                type="text"
                required
                label="First Name"
                value={values.firstName}
                onChange={(e) => setValue('firstName', e.target.value)}
              />
            </Grid>
            <Grid item width=".5">
              <TextField
                fullWidth
                error={showError.lastName}
                helperText={errorMessage.lastName}
                size="small"
                type="text"
                required
                label="Last Name"
                value={values.lastName}
                onChange={(e) => setValue('lastName', e.target.value)}
              />
            </Grid>
          </FormRow>
          <Grid item width="1">
            <TextField
              fullWidth
              error={showError.email}
              helperText={errorMessage.email}
              size="small"
              type="text"
              required
              label="Email"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
            />
          </Grid>
          <FormRow>
            <Grid item width=".5">
              <TextField
                fullWidth
                error={showError.password}
                helperText={errorMessage.password}
                size="small"
                type="password"
                required
                label="Password"
                value={values.password}
                onChange={(e) => setValue('password', e.target.value)}
              />
            </Grid>
            <Grid item container width=".5">
              <TextField
                fullWidth
                error={showError.confirmPassword}
                helperText={errorMessage.confirmPassword}
                size="small"
                type="password"
                required
                label=" Confirm Password"
                value={values.confirmPassword}
                onChange={(e) => setValue('confirmPassword', e.target.value)}
              />
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item container width="1">
              <FormControl error={showError.isProfessional}>
                <FormLabel id="register-licensed-professional-group">
                  Are you a licensed professional?
                </FormLabel>
                <RadioGroup
                  aria-labelledby="register-licensed-professional-group"
                  value={values.isProfessional || ''}
                  onChange={(e) => setValue('isProfessional', e.target.value)}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="No"
                  />
                  <FormHelperText>{errorMessage.isProfessional}</FormHelperText>
                </RadioGroup>
              </FormControl>
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item container width="1">
              <FormControl error={showError.profession}>
                <FormLabel id="register-profession-group">
                  What type of profession best describes you?
                </FormLabel>
                <RadioGroup
                  aria-labelledby="register-profession-group"
                  value={values.profession || ''}
                  onChange={(e) => setValue('profession', e.target.value)}
                >
                  {professionOptions.map((prof) => (
                    <FormControlLabel
                      value={prof}
                      control={<Radio />}
                      label={prof}
                    />
                  ))}
                  <FormHelperText>{errorMessage.isProfessional}</FormHelperText>
                </RadioGroup>
              </FormControl>
            </Grid>
          </FormRow>
          {values.profession === 'Student / Trainee' && (
            <Grid item width="1">
              <FormLabel>What degree are you pursuing?</FormLabel>
              <TextField
                fullWidth
                error={showError.degree}
                helperText={errorMessage.degree}
                size="small"
                type="text"
                required
                label=""
                value={values.degree}
                onChange={(e) => setValue('degree', e.target.value)}
              />
            </Grid>
          )}
          {values.profession === 'Other' && (
            <Grid item width="1">
              <FormLabel>What is your profession?</FormLabel>
              <TextField
                fullWidth
                error={showError.professionOther}
                helperText={errorMessage.professionOther}
                size="small"
                type="text"
                required
                label=""
                value={values.professionOther}
                onChange={(e) => setValue('professionOther', e.target.value)}
              />
            </Grid>
          )}
          <Grid item width="1">
            <FormControl error={showError.settings}>
              <FormLabel>
                What type of setting do you primarily work in? (Select all that
                apply)
              </FormLabel>
              <FormGroup>
                {settingsOptions.map((option) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.settings[option]}
                        onChange={(e) =>
                          setCheckboxValues(option, e.target.value)
                        }
                        name={option}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
              <FormHelperText>{errorMessage.settings}</FormHelperText>
            </FormControl>
          </Grid>
          {values.settings.Other && (
            <Grid item width="1">
              <FormLabel>Please specify other settings: </FormLabel>
              <TextField
                fullWidth
                error={showError.settingOther}
                helperText={errorMessage.settingOther}
                size="small"
                type="text"
                required
                label=""
                value={values.settingOther}
                onChange={(e) => setValue('settingOther', e.target.value)}
              />
            </Grid>
          )}
          <Grid item width="1">
            <FormLabel>
              Approximately what percent of your caseload do you use exposure
              therapy with? (Make sure to respond with a number between 0 and
              100)
            </FormLabel>
            <TextField
              fullWidth
              error={showError.percentCaseload}
              helperText={errorMessage.percentCaseload}
              size="small"
              type="text"
              required
              label=""
              value={values.percentCaseload}
              onChange={(e) => setValue('percentCaseload', e.target.value)}
            />
          </Grid>
          <Grid item width="1">
            <FormControl error={showError.difficulty} sx={{ width: '100%' }}>
              <FormLabel id="register-difficulty-group">
                How difficult do you think it is for exposure therapy to be
                administered?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="register-difficulty-group"
                value={values.difficulty || ''}
                onChange={(e) => setValue('difficulty', e.target.value)}
                sx={{ justifyContent: 'space-between', paddingTop: '10px' }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                  <FormControlLabel
                    value={level}
                    control={<Radio />}
                    label={level}
                    labelPlacement="bottom"
                  />
                ))}
              </RadioGroup>
              <FormHelperText>{errorMessage.difficulty}</FormHelperText>
              <Grid container>
                <Grid
                  justifyContent="center"
                  item
                  xs={4}
                  sx={{ textAlign: 'left' }}
                >
                  <Typography variant="caption">
                    (1 - Not difficult at all)
                  </Typography>
                </Grid>
                <Grid
                  justifyContent="center"
                  item
                  xs={4}
                  sx={{ textAlign: 'center' }}
                >
                  <Typography variant="caption">
                    (4 - Somewhat difficult)
                  </Typography>
                </Grid>
                <Grid
                  justifyContent="center"
                  item
                  xs={4}
                  sx={{ textAlign: 'right' }}
                >
                  <Typography variant="caption">
                    (7 - Very difficult)
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid item width="1">
                <FormControl error={showError.signed}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <FormLabel>
                      I affirm that I am a licensed psychologist, a mental
                      health professional or a trainee in a mental health
                      discipline.
                    </FormLabel>
                    <Checkbox
                      checked={signed}
                      onChange={() => setSigned(!signed)}
                    />
                  </div>
                  <FormHelperText>{errorMessage.signed}</FormHelperText>
                </FormControl>
              </Grid>
            </FormControl>
          </Grid>
          <Grid item container justifyContent="center">
            <PrimaryButton
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Register
            </PrimaryButton>
          </Grid>
          <FormRow>
            <Grid container justifyContent="center">
              <Link component={RouterLink} to="../">
                Back to Login
              </Link>
            </Grid>
          </FormRow>
        </FormCol>
        {/* The alert that pops up */}
        <Grid item>
          <AlertDialog
            showAlert={showError.alert}
            title={alertTitle}
            message={errorMessage.alert}
            onClose={handleAlertClose}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RegisterPage;
