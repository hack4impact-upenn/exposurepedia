/* eslint-disable react/react-in-jsx-scope,@typescript-eslint/ban-types */
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { ExposureItemTable, TRow } from './ExposureItemTable';
import HierarchyDropdown from './HierarchyDropdown';
import Filters from './Filters';
import { getData, postData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import GeneralSearch from './GeneralSearch';

/**
 * A page only accessible to authenticated users that display exposure items in
 * a table and allows users to filter and query exposure items as well as add them
 * to hierarchies.
 */
function Exposurepedia() {
  const initFilterOptions = {
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
    Format: {
      Video: false,
      Picture: false,
      Idea: false,
      Script: false,
      Reading: false,
      Audio: false,
    },
    'Intervention Type': {
      'In Vivo': false,
      Imaginal: false,
      Interoceptive: false,
      Psychoeducation: false,
      'Stimulus Control': false,
      'Psychiatric Hospital': false,
      'Habit Reversal Training': false,
    },
    Maturity: {
      Children: false,
      Adults: false,
    },
    Keyword: {},
  };
  const fetchFilterKeywordData = async () => {
    const res = await postData(`exposure/keyword`, {
      query: '',
    });
    const allKeywords = Object.assign(
      {},
      ...res.data.map((k: any) => ({ [k.name]: false })),
    );
    initFilterOptions.Keyword = allKeywords;
  };
  fetchFilterKeywordData();

  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState<TRow[]>(rows);
  const [filterOptions, setFilterOptions] = useState(initFilterOptions);
  const [hierarchies, setHierarchies] = useState([]);
  const [query, setQuery] = useState('');
  const user = useAppSelector(selectUser);
  const email = user?.email?.toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData(`hierarchy/${email}`);
      setHierarchies(res?.data);
    };
    fetchData();
  }, [email]);

  const columns = [
    { id: 'checkbox', label: '', minWidth: 15 },
    { id: 'name', label: 'Title', minWidth: 170 },
    { id: 'formats', label: 'Format', minWidth: 100 },
    { id: 'likes', label: 'Likes', minWidth: 100 },
    { id: 'createdAt', label: 'Date', minWidth: 100 },
  ];

  const sfo = (o: any) => {
    setFilterOptions({
      ...o,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const f = (arr: any) => {
        const emp: Object[] = [];
        const flattenedObj = Object.assign(
          {},
          ...(function flatten(o: any): Object[] {
            return emp.concat(
              ...Object.keys(o).map((k) => {
                if (typeof o[k] === 'boolean' && o[k]) {
                  return { [k]: 'temp' };
                }
                return [...flatten(o[k])];
              }),
            );
          })(arr),
        );
        return Object.keys(flattenedObj);
      };

      const disorders = f(filterOptions.Disorder);

      const formats = f(filterOptions.Format);

      const interventionTypes = f(filterOptions['Intervention Type']);

      const isAdultAppropriate = filterOptions.Maturity.Adults;
      const isChildAppropriate = filterOptions.Maturity.Children;

      const keywords = f(filterOptions.Keyword);

      const response = await postData('exposure/filter', {
        disorders,
        formats,
        interventionTypes,
        isAdultAppropriate,
        isChildAppropriate,
        keywords,
        isLinkBroken: false,
        isApproved: true,
        getApproved: true,
        query,
      });
      setRows(response.data);
    };
    fetchData();
  }, [
    filterOptions,
    filterOptions.Maturity.Adults,
    filterOptions.Maturity.Children,
    query,
  ]);

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Filters filterOptions={filterOptions} setFilterOptions={sfo} />
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
            <HierarchyDropdown
              hierarchies={hierarchies}
              count={count}
              setCount={setCount}
              exposureItems={selectedRows}
              setSelectedRows={setSelectedRows}
            />
            <GeneralSearch
              name="disorders"
              search={query}
              handleChange={(e: string) => setQuery(e)}
            />
            <ExposureItemTable
              rows={rows}
              columns={columns}
              isApprove={false}
              isBroken={false}
              setCount={setCount}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default Exposurepedia;
