/* eslint-disable react/react-in-jsx-scope,@typescript-eslint/ban-types */

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import { ExposureItemTable, TRow } from './ExposureItemTable';
import HierarchyDropdown from './HierarchyDropdown';
import Filtering2 from './Filtering2';
import { getData, postData } from '../util/api';
import filterOptionsData from './filterdata';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */

function Exposurepedia() {
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState<TRow[]>(rows);
  const [filterOptions, setFilterOptions] = useState(filterOptionsData);
  const [hierarchies, setHierarchies] = useState([]);
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
            <HierarchyDropdown
              hierarchies={hierarchies}
              count={count}
              setCount={setCount}
              exposureItems={selectedRows}
              setSelectedRows={setSelectedRows}
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
