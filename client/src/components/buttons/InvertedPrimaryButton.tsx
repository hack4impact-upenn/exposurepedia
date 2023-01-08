import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import COLORS from '../../assets/colors';

/**
 * The {@link Button} used for most action items.
 */
const InvertedPrimaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
  borderRadius: '5px',
  padding: '0.5rem 2rem',
  // color: 'black',
  borderColor: COLORS.primaryBlue,
  textDecoration: 'none',
  transition: 'box-shadow 0.2s ease 0s',
  textAlign: 'center',
  fontWeight: 'bold',
  textTransform: 'none',
  background: COLORS.white,
}));

export default InvertedPrimaryButton;
