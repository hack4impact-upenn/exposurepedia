import {
  Box,
  Checkbox,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchComponent from '../Exposurepedia/SearchComponent';

interface filterOption {
  [key: string]: filterOption | boolean;
}

class FilterOption implements filterOption {
  [key: string]: filterOption | boolean;
}

const filterOptionsData: FilterOption = {
  Disorder: {
    'Body Dysmorphia': false,
    'Generalized Anxiety': false,
    'Health Anxiety/Medical Phobia': {
      'Blood/Injection/Injury': false,
      'Dental Phobia': false,
    },
    Hoarding: false,
    'Obsessive Compulsive Disorder (OCD)': {
      'Aggressive/Violent': {
        'Fear of Being a Sociopath/Murderer': false,
        'Fear of a Hit-and-Run': false,
        'Fear of Self-Harm': false,
      },
      Checking: false,
      Contamination: { 'Emotional/Mental Contamination': false },
      Existential: {
        'Fear of Wasting Time': false,
      },
      'Fear of Acting on Unwanted Impulses': false,
      'Fear of Being Cancelled': false,
      'Fear of Being Misunderstood': false,
      'Fear of Contracting Sexually-Transmitted Diseases/HIV/AIDs': false,
      'Fear of Developing Other Types of OCD': false,
      'Fear of Forgetting': false,
      'Fear of Getting in Trouble': false,
      'Fear of Going Crazy': false,
      'Fear of Making the Wrong Decision': {
        'Fear of Buying the Wrong Thing': false,
      },
      'Fear of Unintentionally Causing Harm': false,
      'Magical Numbers': false,
      'Need to Know': false,
      'Not Just Right': false,
      Perfectionism: false,
      'Relationship OCD': { 'Retractive Jealousy': false },
      'Scrupulosity/Morality': {
        'Fear of Being Racist': false,
        'Fear of Sinning/Committing Blasphemy': false,
      },
      'Sexual/Gender': {
        'Fear of Being Gay/Straight': false,
        'Fear of Being Trans': false,
        'Fear of Being a Pedophile': false,
      },
      'Somatic OCD': false,
      'Symmetry/Ordering': false,
      'Fear of Uncertainty': false,
    },
    'Panic/Agoraphobia': false,
    'Specific Phobia': {
      Animals: {
        Birds: false,
        Bugs: {
          Spiders: false,
          'House Centipedes': false,
          Bees: false,
        },
        Cats: false,
        Dogs: false,
        Fish: false,
        'Mice/Rats': false,
        Sharks: false,
        Snakes: false,
      },
      Claustriphobia: false,
      Choking: false,
      Dark: false,
      Driving: false,
      Flying: false,
      Heights: false,
      'Storms/Natural Disasters': false,
      Trypophobia: false,
      'Vomit (Emetophobia)': false,
    },
    'Posttraumatic Stress Disorder (PTSD)': {
      'Combat/Military/Terrorism': false,
      'Sexual Assault': false,
      'Car Accident': false,
    },
    'Separation Anxiety': false,
    'Social Anxiety': false,
    'Trichotillomania/Excoriation': false,
  },
  Format: {},
  'Intervention Type': {},
  Maturity: {},
  Keyword: {},
};

function Filtering() {
  const drawerWidth = 380;

  const e: string[] = [];
  const [filterHistory, setFilterHistory] = useState(e);
  const [filterOptions, setFilterOptions] = useState(filterOptionsData);
  const [current, setCurrent] = useState('');
  const [dummy, setDummy] = useState(false);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState(e);

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

    // setFilter(newFilter);
    setFilterHistory(filterHistory.slice(0, filterHistory.length - 1));

    if (filterHistory.length > 1) {
      setCurrent(filterHistory[filterHistory.length - 2]);
    }
  };

  const checkIsLast = (key: string) => {
    let val: any = filterOptions;
    for (let i = 0; i < filterHistory.length; i += 1) {
      val = val[filterHistory[i]];
    }
    return val[key] === true || val[key] === false;
  };

  const getTags = (key: string) => {
    let list = [...tags];
    const tempOptions = filterOptions;
    let val: any = tempOptions;
    for (let i = 0; i < filterHistory.length; i += 1) {
      val = val[filterHistory[i]];
    }
    let queue: [string[], string][] = [[[], key]];
    while (queue.length > 0) {
      const temp: string[] = queue[0][0];
      const tempK = queue[0][1];
      let tempVal = val;
      for (let i = 0; i < temp.length; i += 1) {
        tempVal = tempVal[temp[i]];
      }
      if (typeof tempVal[tempK] === 'boolean' && tempVal[tempK]) {
        list.push(tempK);
      }
      if (
        typeof tempVal[tempK] === 'boolean' &&
        !tempVal[tempK] &&
        list.includes(tempK)
      ) {
        list = list.filter((item) => item !== tempK);
      }
      tempVal = tempVal[tempK];
      queue = queue.slice(1);
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const k in tempVal) {
        const newItem: [string[], string] = [[...temp, tempK], k];
        queue.push(newItem);
      }
    }
    setTags(list);
  };

  const checkChildrenTrue = (key: string) => {
    let val: any = filterOptions;
    for (let i = 0; i < filterHistory.length; i += 1) {
      val = val[filterHistory[i]];
    }
    let queue: [string[], string][] = [[[], key]];
    while (queue.length > 0) {
      const temp: string[] = queue[0][0];
      const tempK = queue[0][1];
      let tempVal = val;
      for (let i = 0; i < temp.length; i += 1) {
        tempVal = tempVal[temp[i]];
      }
      tempVal = tempVal[tempK];
      if (typeof tempVal === 'boolean') {
        if (!tempVal) {
          return false;
        }
      }
      queue = queue.slice(1);
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const k in tempVal) {
        const newItem: [string[], string] = [[...temp, tempK], k];
        queue.push(newItem);
      }
    }
    return true;
  };

  const selectAllChildren = (key: string, boolVal: boolean) => {
    const tempOptions = filterOptions;
    let val: any = tempOptions;
    for (let i = 0; i < filterHistory.length; i += 1) {
      val = val[filterHistory[i]];
    }
    let queue: [string[], string][] = [[[], key]];
    while (queue.length > 0) {
      const temp: string[] = queue[0][0];
      const tempK = queue[0][1];
      let tempVal = val;
      for (let i = 0; i < temp.length; i += 1) {
        tempVal = tempVal[temp[i]];
      }
      if (typeof tempVal[tempK] === 'boolean') {
        tempVal[tempK] = boolVal;
      }
      tempVal = tempVal[tempK];
      queue = queue.slice(1);
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const k in tempVal) {
        const newItem: [string[], string] = [[...temp, tempK], k];
        queue.push(newItem);
      }
    }
    setFilterOptions(tempOptions);
  };

  const searchSubstring = (key: string) => {
    const list = [];
    let val: any = filterOptions;
    // for (let i = 0; i < filterHistory.length; i += 1) {
    val = val[key];
    // }
    let queue: [string[], string][] = [[[], key]];
    while (queue.length > 0) {
      const temp: string[] = queue[0][0];
      const tempK = queue[0][1];
      let tempVal = val;
      for (let i = 1; i < temp.length; i += 1) {
        tempVal = tempVal[temp[i]];
      }
      // console.log('hii');
      // console.log(temp);
      // console.log(tempVal);
      // console.log(tempK);
      if (typeof tempVal[tempK] === 'boolean' && tempK.indexOf(search) !== -1) {
        list.push(tempK);
      }
      queue = queue.slice(1);
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const k in tempVal) {
        const newItem: [string[], string] = [[...temp, tempK], k];
        // console.log('new item');
        // console.log(newItem);
        queue.push(newItem);
      }
    }
    // console.log('list');
    // console.log(list);
  };

  const selectChild = (key: string) => {
    const tempOptions = filterOptions;
    let val: any = tempOptions;
    for (let i = 0; i < filterHistory.length; i += 1) {
      val = val[filterHistory[i]];
    }
    if (typeof val[key] === 'boolean') {
      val[key] = !val[key];
      setFilterOptions(tempOptions);
    } else if (checkChildrenTrue(key)) {
      selectAllChildren(key, false);
    } else {
      selectAllChildren(key, true);
    }
    setDummy(!dummy);
  };

  const handleFilterSelect = (key: string) => {
    if (!checkIsLast(key)) {
      setCurrent(key);
      setFilterHistory([...filterHistory, key]);
    } else {
      // console.log('hi');
    }
  };

  const getFilter = () => {
    let val: any = filterOptions;
    for (let i = 0; i < filterHistory.length; i += 1) {
      val = val[filterHistory[i]];
    }
    // console.log('val');
    // console.log(val);
    return val;
  };

  const getChecked = (text: string): boolean => {
    // console.log('hi');
    if (checkChildrenTrue(text)) {
      return true;
    }
    const tempOptions = filterOptions;
    let val: any = tempOptions;
    for (let i = 0; i < filterHistory.length; i += 1) {
      val = val[filterHistory[i]];
    }
    return typeof val[text] === 'boolean' ? val[text] : false;
  };

  return (
    <div>
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
          <Typography
            sx={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: '22px',
              background: '#00538E',
              height: '60px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: '15px',
            }}
          >
            Search and Filter
          </Typography>
          <List sx={{ margin: '0px', padding: '0px' }}>
            {filterHistory.length > 0 && (
              <div>
                <ListItem
                  key="back"
                  disablePadding
                  sx={{
                    background: '#F5F8FC',
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <ListItemButton
                    sx={{ height: '50px' }}
                    onClick={handleFilterBack}
                  >
                    <ArrowBackIcon />
                    <span style={{ marginLeft: '5px' }}>{current}</span>
                  </ListItemButton>
                </ListItem>
                <div style={{ overflow: 'none' }}>
                  <div
                    style={
                      tags.length > 0
                        ? {
                            overflow: 'auto',
                            scrollbarWidth: 'none',
                            whiteSpace: 'nowrap',
                            marginTop: '8px',
                            paddingBottom: '10px',
                          }
                        : {
                            overflow: 'auto',
                            scrollbarWidth: 'none',
                            whiteSpace: 'nowrap',
                            marginTop: '8px',
                          }
                    }
                  >
                    {tags.map((item) => (
                      <Chip
                        sx={{ margin: '0px 2px' }}
                        label={item}
                        color="primary"
                        variant="outlined"
                        onDelete={() => {
                          checkChildrenTrue(item);
                          selectChild(item);
                          getTags(item);
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ width: '100%', margin: 'auto' }}>
                  <SearchComponent
                    name={`${
                      filterHistory[0].substring(0, 1) +
                      filterHistory[0].substring(1).toLowerCase()
                    }s`}
                    search={search}
                    handleChange={(value) => {
                      setSearch(value);
                      searchSubstring(filterHistory[0]);
                    }}
                  />
                </div>
              </div>
            )}
            {Object.keys(getFilter()).map((text) => (
              <ListItem
                sx={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}
                key={text}
                disablePadding
              >
                {filterHistory.length !== 0 && (
                  <Checkbox
                    checked={dummy ? getChecked(text) : getChecked(text)}
                    onChange={() => {
                      checkChildrenTrue(text);
                      selectChild(text);
                      getTags(text);
                    }}
                  />
                )}
                <ListItemButton onClick={() => handleFilterSelect(text)}>
                  <ListItemText primary={text}>{text}</ListItemText>
                  {!checkIsLast(text) && <ChevronRightIcon />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}

export default Filtering;
