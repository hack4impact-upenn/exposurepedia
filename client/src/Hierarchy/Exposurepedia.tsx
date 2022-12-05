/* eslint-disable react/react-in-jsx-scope */

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ExposureItemTable } from '../components/ExposureItemTable';
import HierarchyDropdown from './HierarchyDropdown';

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */

interface filterOption {
  [key: string]: filterOption | boolean;
}

class FilterOption implements filterOption {
  [key: string]: filterOption | boolean;
}

const filterOptions: FilterOption = {
  Disorder: {
    'Body Dysmorphia': false,
    'Generalized Anxiety': false,
    'Health Anxiety/Medical Phobia': {
      'Blood/Injection/Injury': false,
      'Dental Phobia': false,
    },
    Hoarding: {},
    'Obsessive Compulsive Disorder (OCD)': {
      'Aggressive/Violent': {
        'Fear of Being a Sociopath/Murderer': {},
        'Fear of a Hit-and-Run': {},
        'Fear of Self-Harm': {},
      },
      Checking: {},
      Contamination: { 'Emotional/Mental Contamination': {} },
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
      'Relationship OCD': { 'Retractive Jealousy': {} },
      'Scrupulosity/Morality': {
        'Fear of Being Racist': {},
        'Fear of Sinning/Committing Blasphemy': {},
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
        Bugs: {
          Spiders: {},
          'House Centipedes': {},
          Bees: {},
        },
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
  },
  Format: {},
  'Intervention Type': {},
  Maturity: {},
  Keyword: {},
};

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

function Exposurepedia() {
  const [count, setCount] = useState(0);

  const hierarchies = [
    'Hierarchy 0',
    'Hierarchy 1',
    'Hierarchy 2',
    'Hierarchy 3',
    'Hierarchy 4',
    'Hierarchy 5',
    'Hierarchy 6',
    'Hierarchy 7',
    'Hierarchy 8',
    'Hierarchy 9',
  ];

  const rows = [
    {
      key: '1',
      title: 'Write your own obituary',
      format: 'Idea',
      likes: 45,
      date: '2021-10-10',
    },
    {
      key: '2',
      title: 'Young boy gets blood drawn',
      format: 'Reading',
      likes: 2,
      date: '2022-10-2',
    },
    {
      key: '3',
      title: 'Young girl gets a painfree shot',
      format: 'Video',
      likes: 100,
      date: '2021-11-04',
    },
  ];

  const columns = [
    { id: 'checkbox', label: '', minWidth: 15 },
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'format', label: 'Format', minWidth: 100 },
    { id: 'likes', label: 'Likes', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 100 },
  ];
  const drawerWidth = 240;

  const e: string[] = [];
  const [filterHistory, setFilterHistory] = useState(e);
  const [filter, setFilter] = useState(filterOptions);

  const handleFilterBack = () => {
    if (filterHistory.length === 0) {
      return;
    }

    let newFilter = filterOptions;
    for (let i = 0; i < filterHistory.length - 1; i += 1) {
      const f: any = newFilter[filterHistory[i]];
      if (f instanceof Object) {
        newFilter = f;
      } else {
        break;
      }
    }

    setFilter(newFilter);
    setFilterHistory(filterHistory.slice(0, filterHistory.length - 1));
  };

  const handleFilterSelect = (key: string) => {
    const f = filter[key];
    if (typeof f === 'boolean') {
      let nf = filterOptions;
      for (let i = 0; i < filterHistory.length; i += 1) {
        const f2: any = nf[filterHistory[i]];
        if (f2 instanceof Object) {
          nf = f2;
        } else {
          break;
        }
      }
      console.log(filter);
      console.log(filter[key]);
      nf[key] = !nf[key];
      setFilter({
        ...filter,
        [key]: !nf[key],
      });
    } else {
      setFilter(f);
      setFilterHistory([...filterHistory, key]);
    }
  };

  const getChecked = (f: any) => {
    return typeof f === 'boolean' ? f : false;
  };

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {filterHistory.length > 0 && (
                <ListItem key="back" disablePadding>
                  <ListItemButton onClick={handleFilterBack}>
                    <ArrowBackIcon />
                    Back
                  </ListItemButton>
                </ListItem>
              )}
              {Object.keys(filter).map((text) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton onClick={() => handleFilterSelect(text)}>
                    {filter[text] instanceof Object ? (
                      ''
                    ) : (
                      <Checkbox checked={getChecked(filter[text])} />
                    )}
                    <ListItemText primary={text}>{text}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <HierarchyDropdown hierarchies={hierarchies} count={count} />
            <ExposureItemTable
              rows={rows}
              columns={columns}
              isApprove={false}
              isBroken={false}
              setCount={setCount}
            />
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default Exposurepedia;
