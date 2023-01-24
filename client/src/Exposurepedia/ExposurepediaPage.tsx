/* eslint-disable react/react-in-jsx-scope,@typescript-eslint/ban-types */

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import { ExposureItemTable } from './ExposureItemTable';
import HierarchyDropdown from '../Hierarchy/HierarchyDropdown';
import Filtering2 from './Filtering2';
import { getData, postData } from '../util/api';
import filterOptionsData from './filterdata';

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */

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
  const [rows, setRows] = useState([]);
  const [filterOptions, setFilterOptions] = useState(filterOptionsData);

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
      });
      setRows(response.data);
    };
    fetchData();
  }, [
    filterOptions,
    filterOptions.Maturity.Adults,
    filterOptions.Maturity.Children,
  ]);

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Filtering2 filterOptions={filterOptions} setFilterOptions={sfo} />
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
