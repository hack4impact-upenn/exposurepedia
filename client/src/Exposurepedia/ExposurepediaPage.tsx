/* eslint-disable react/react-in-jsx-scope,@typescript-eslint/ban-types */
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { ExposureItemTable, TRow } from './ExposureItemTable';
import HierarchyDropdown from './HierarchyDropdown';
import Filters from './Filters';
import { getData, postData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import GeneralSearch from './GeneralSearch';
import { selectFilters } from '../util/redux/filterSlice';

/**
 * A page only accessible to authenticated users that display exposure items in
 * a table and allows users to filter and query exposure items as well as add them
 * to hierarchies.
 */
function Exposurepedia() {
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [initFilterOptions, setInitFilterOptions] = useState<any>({});
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState<TRow[]>(rows);
  const [filterOptions, setFilterOptions] = useState(initFilterOptions);
  const [hierarchies, setHierarchies] = useState([]);
  const [query, setQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('likes');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const user = useAppSelector(selectUser);
  const filters = useAppSelector(selectFilters);
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
    { id: 'updatedAt', label: 'Date', minWidth: 100 },
  ];

  const sfo = (o: any) => {
    setFilterOptions({
      ...o,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingFilters(false);
      setInitFilterOptions(filters.filters);
      setFilterOptions(filters.filters);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      const isAdultAppropriate =
        filterOptions['Adult/Child Friendly']['Adult Friendly'];
      const isChildAppropriate =
        filterOptions['Adult/Child Friendly']['Child Friendly'];

      const filteredQuery = query.replace(/[^a-zA-Z0-9 ]/g, '');

      const response = await postData('exposure/filter', {
        disorders,
        formats,
        interventionTypes,
        isAdultAppropriate,
        isChildAppropriate,
        isLinkBroken: false,
        isApproved: true,
        query: filteredQuery,
        sortColumn,
        sortDirection,
      });
      setRows(response.data);
      setIsLoadingTable(false);
    };
    fetchData();
  }, [filterOptions, query, sortColumn, sortDirection]);

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Filters
          filterOptions={filterOptions}
          setFilterOptions={sfo}
          isLoading={isLoadingFilters}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
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
              name="disorders by title, keywords, and modifications"
              search={query}
              handleChange={(e: string) => setQuery(e)}
            />
            {isLoadingTable ? (
              <CircularProgress />
            ) : (
              <ExposureItemTable
                rows={rows}
                columns={columns}
                isApprove={false}
                isBroken={false}
                setCount={setCount}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                sortColumn={sortColumn}
                setSortColumn={setSortColumn}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              />
            )}
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default Exposurepedia;
