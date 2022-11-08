import React from 'react';
import { Box, Chip, Link, Paper, Typography } from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';

interface ExposureItemProps {
  item: Item;
}

interface Item {
  title: string;
  disorder: string[];
  format: string[];
  interventionType: string[];
  maturity: string[];
  keywords: string[];
  modifications: string;
  link: string;
}

export default function ExposureItem({ item }: ExposureItemProps) {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        margin: '1rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{ mr: '0.25rem' }}>
            <strong>{item.title}</strong>
          </Typography>
          <FavoriteBorder />
          <Typography>0</Typography>
        </Box>
        <Box>
          <Typography>Last updated October 1st 2022</Typography>
        </Box>
      </Box>

      {['disorder', 'format', 'interventionType', 'maturity', 'keywords'].map(
        (key) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              my: '0.25rem',
            }}
          >
            <Typography>
              <strong>{key[0].toUpperCase() + key.substring(1)}:</strong>{' '}
            </Typography>
            {Object(item)[key].map((value: string) => (
              <Chip
                sx={{ mx: '0.25rem' }}
                label={value}
                onDelete={() => ({})}
              />
            ))}
          </Box>
        ),
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          my: '0.25rem',
        }}
      >
        <Typography>
          <strong>Modifications: </strong>
          {item.modifications}
        </Typography>
      </Box>
      {item.link !== '' && (
        <div>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              my: '0.25rem',
            }}
          >
            <Typography>
              <strong>Link: </strong>
              <Link href={item.link}>{item.link}</Link>
            </Typography>
          </Box>
          {item.link.includes('youtube') && (
            <iframe
              width="640"
              height="480"
              src={`https://www.youtube.com/embed/${item.link
                .split('=')
                .at(-1)}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          )}
        </div>
      )}
    </Paper>
  );
}
