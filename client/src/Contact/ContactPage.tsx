import React, { useState } from 'react';
import { TextField, Grid, Typography } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import FormCol from '../components/form/FormCol';
import {
  emailRegex,
  InputErrorMessage,
  nameRegex,
} from '../util/inputvalidation';
import AlertDialog from '../components/AlertDialog';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { contact } from './api';

/**
 * A page users visit to be able to register for a new account by inputting
 * fields such as their name, email, and password.
 */
function ContactPage() {
  const navigate = useNavigate();

  const bottomTextValue =
    'Note: If you have a resource you would like added to The Exposurepedia, please use the Submit Resources form, not this page! If you would like to provide feedback about the site or contact us for another reason, please do so below. Name and email address are not required, but we cannot respond unless you provide an email. If you would like to be contacted once the resources have been made public, note that below, and be sure to include your email.';

  // Default values for state
  const defaultValues = {
    name: '',
    email: '',
    message: '',
  };
  const defaultShowErrors = {
    name: false,
    email: false,
    message: false,
    alert: false,
  };
  const defaultErrorMessages = {
    name: '',
    email: '',
    message: '',
    alert: '',
  };
  type ValueType = keyof typeof values;

  // State values and hooks
  const [values, setValueState] = useState(defaultValues);
  const [showError, setShowErrorState] = useState(defaultShowErrors);
  const [errorMessage, setErrorMessageState] = useState(defaultErrorMessages);
  const [alertTitle, setAlertTitle] = useState('Error');
  const [contacted, setContacted] = useState(false);

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

  const handleAlertClose = () => {
    if (contacted) {
      navigate('/contact');
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

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const valueTypeString in values) {
      const valueType = valueTypeString as ValueType;
      if (!values[valueType]) {
        setErrorMessage(valueTypeString, InputErrorMessage.MISSING_INPUT);
        setShowError(valueTypeString, true);
        isValid = false;
      }
    }

    if (!values.name.match(nameRegex)) {
      setErrorMessage('firstName', InputErrorMessage.INVALID_NAME);
      setShowError('firstName', true);
      isValid = false;
    }
    if (!values.email.match(emailRegex)) {
      setErrorMessage('email', InputErrorMessage.INVALID_EMAIL);
      setShowError('email', true);
      isValid = false;
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateInputs()) {
      contact(values.name, values.email, values.message)
        .then(() => {
          setShowError('alert', true);
          setAlertTitle('');
          setContacted(true);
          setErrorMessage('alert', 'Contacted!');
        })
        .catch((e) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  }

  const title = 'Contact Us';
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
          <Grid item width="1">
            <TextField
              fullWidth
              error={showError.name}
              helperText={errorMessage.name}
              size="small"
              type="text"
              required
              label="Name"
              value={values.name}
              onChange={(e) => setValue('name', e.target.value)}
            />
          </Grid>
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
          <Grid item width="1">
            <TextField
              fullWidth
              error={showError.message}
              helperText={errorMessage.message}
              size="small"
              type="text"
              required
              label="Message"
              value={values.message}
              onChange={(e) => setValue('message', e.target.value)}
            />
          </Grid>
          <Grid item container justifyContent="center">
            <PrimaryButton
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Submit
            </PrimaryButton>
          </Grid>
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
        <br />
        <br />
        <Typography color="text.secondary">{bottomTextValue}</Typography>
      </Grid>
    </Grid>
  );
}

export default ContactPage;
