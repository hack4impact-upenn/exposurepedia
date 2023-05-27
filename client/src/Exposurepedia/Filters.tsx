/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { ArrowBack, ChevronRight } from '@mui/icons-material';
import SearchComponent from './SearchComponent';

function Filters({ filterOptions, setFilterOptions, isLoading }: any) {
  const emptyArr: string[] = [];
  const emptyObj: { [key: string]: string[] } = {
    Disorder: emptyArr,
    Format: emptyArr,
    'Intervention Type': emptyArr,
    'Adult/Child Friendly': emptyArr,
  };
  const [current, setCurrent] = useState('');
  const [path, setPath] = useState(emptyArr);
  const [tags, setTags] = useState(emptyObj);
  const [change, setChange] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(emptyArr);

  const getCurrentList = (p: string[], forDisplay = false) => {
    let tempPath: any = p;
    let tempOptions: any = {};
    Object.assign(tempOptions, filterOptions);
    while (tempPath.length > 0) {
      tempOptions = tempOptions[tempPath[0]];
      tempPath = tempPath.slice(1);
    }
    if (tempOptions && tempOptions.Keyword && forDisplay) {
      tempOptions.Keyword = Object.fromEntries(
        Object.entries(tempOptions.Keyword).slice(0, 5),
      );
    }
    return tempOptions;
  };

  const findPath = (item: string) => {
    let p: string[] = [];
    let queue: [string[], string][] = [];
    for (const k of Object.keys(filterOptions)) {
      const emp: string[] = [];
      queue.push([emp, k]);
    }
    while (queue.length > 0) {
      const tempPath = queue[0][0];
      const tempKey = queue[0][1];

      let tempPos: any = filterOptions;
      for (let i = 0; i < tempPath.length; i += 1) {
        tempPos = tempPos[tempPath[i]];
      }
      if (tempKey === item) {
        p = tempPath;
        break;
      }
      tempPos = tempPos[tempKey];

      queue = queue.slice(1);

      for (const k in tempPos) {
        const newItem: [string[], string] = [[...tempPath, tempKey], k];
        queue.push(newItem);
      }
    }
    return p;
  };

  const handleSearchChange = async (str: string) => {
    const currList = getCurrentList(path);
    const emp: Object[] = [];
    const flattenedObj = Object.assign(
      {},
      ...(function flatten(o: any): Object[] {
        return emp.concat(
          ...Object.keys(o).map((k) => {
            if (typeof o[k] === 'boolean') {
              return { [k]: 'temp' };
            }
            return [...flatten(o[k]), { [k]: 'temp' }];
          }),
        );
      })(currList),
    );
    const itemsBelow = Object.keys(flattenedObj);
    setSearchResults(
      itemsBelow.filter(
        (it) => it.toLowerCase().indexOf(str.toLowerCase()) !== -1,
      ),
    );
    setSearch(str);
  };
  const checkIsLast = (item: string, p: string[]) => {
    const tempPath = [...p];
    tempPath.push(item);
    return typeof getCurrentList(tempPath) === 'boolean';
  };

  const countNodes = (p: string[]) => {
    const currList = getCurrentList(p.slice(0, p.length - 1));
    let count = 0;
    let queue: [string[], string][] = [[[], p[p.length - 1]]];

    while (queue.length > 0) {
      const tempPath: string[] = queue[0][0];
      const tempKey = queue[0][1];

      let tempPos = currList;
      for (let i = 0; i < tempPath.length; i += 1) {
        tempPos = tempPos[tempPath[i]];
      }
      tempPos = tempPos[tempKey];

      count += 1;

      queue = queue.slice(1);

      for (const k in tempPos) {
        const newItem: [string[], string] = [[...tempPath, tempKey], k];
        queue.push(newItem);
      }
    }
    return count;
  };

  const checkChildrenTrue = (p: string[], item: string) => {
    const currList = getCurrentList(p);
    let queue: [string[], string][] = [[[], item]];
    while (queue.length > 0) {
      const tempPath: string[] = queue[0][0];
      const tempKey = queue[0][1];

      let tempPos = currList;
      for (let i = 0; i < tempPath.length; i += 1) {
        tempPos = tempPos[tempPath[i]];
      }
      tempPos = tempPos[tempKey];

      if (typeof tempPos === 'boolean' && !tempPos) {
        return false;
      }

      queue = queue.slice(1);

      for (const k in tempPos) {
        const newItem: [string[], string] = [[...tempPath, tempKey], k];
        queue.push(newItem);
      }
    }
    return true;
  };

  const selectAllChildren = (item: string, bool: boolean, p: string[]) => {
    const tempOptions = filterOptions;
    let val: any = tempOptions;
    for (let i = 0; i < p.length; i += 1) {
      val = val[p[i]];
    }
    let queue: [string[], string][] = [[[], item]];
    while (queue.length > 0) {
      const tempPath: string[] = queue[0][0];
      const tempKey = queue[0][1];

      let tempPos = val;
      for (let i = 0; i < tempPath.length; i += 1) {
        tempPos = tempPos[tempPath[i]];
      }

      if (typeof tempPos[tempKey] === 'boolean') {
        tempPos[tempKey] = bool;
      }
      tempPos = tempPos[tempKey];

      queue = queue.slice(1);

      for (const k in tempPos) {
        const newItem: [string[], string] = [[...tempPath, tempKey], k];
        queue.push(newItem);
      }
    }

    setFilterOptions(tempOptions);
  };

  const isItemChecked = (item: string, p: string[]) => {
    if (checkChildrenTrue(p, item)) {
      return true;
    }
    const currList = getCurrentList(p);
    return typeof currList[item] === 'boolean' ? currList[item] : false;
  };

  const layerIsChecked = (p: string[]) => {
    const currList = getCurrentList(p);
    for (const k of Object.keys(currList)) {
      if (
        !checkChildrenTrue(p, k) ||
        (typeof currList[k] === 'boolean' && !currList[k])
      ) {
        return false;
      }
    }
    return true;
  };

  const addTag = (item: string, p: string[]) => {
    const type: string = p[0];
    let currTags: string[] = tags[type];
    const currList = getCurrentList(p);
    if (!isItemChecked(item, p)) {
      // currently checked, waiting to unadd
      /* Cases:
        1) check a normal box, nothing changes
        2) check a box, everything below it is unadded so we just add it
        3) check a box, some stuff below is checked so we need to unadd those
        4) check a box, everything in that layer is now added so we need to go to the parent and add that

        1) uncheck a box, nothing changes
        2) uncheck a box, everything in that layer is checked so we need to add all of them and unadd the parent
        3) uncheck a box, everthing below gets unadded as well
      */
      if (currTags && currTags.includes(item)) {
        currTags = currTags.filter((it) => it !== item);
      } else {
        let top = -1;
        for (let i = p.length - 1; i >= 0; i -= 1) {
          if (currTags.includes(p[i])) {
            top = i;
          }
        }
        for (let i = top === -1 ? 0 : top; i < path.length; i += 1) {
          const temp = Object.keys(getCurrentList(p.slice(0, i + 1)));
          currTags = [...currTags, ...temp];
        }
        currTags = currTags.filter(
          (it) => it !== item && it !== `All ${p[0]}s` && !p.includes(it),
        );
      }
    } else if (layerIsChecked(p)) {
      const emp: Object[] = [];
      const flattenedObj = Object.assign(
        {},
        ...(function flatten(o: any): Object[] {
          return emp.concat(
            ...Object.keys(o).map((k) => {
              if (typeof o[k] === 'boolean') {
                return { [k]: 'temp' };
              }
              return [...flatten(o[k]), { [k]: 'temp' }];
            }),
          );
        })(currList),
      );
      const itemsBelow = new Set(Object.keys(flattenedObj));
      currTags = currTags.filter((it) => !itemsBelow.has(it));
      const firstLayer = new Set(Object.keys(filterOptions));
      if (firstLayer.has(p[p.length - 1])) {
        currTags.push(`All ${p[p.length - 1]}s`);
      } else {
        currTags.push(p[p.length - 1]);
      }
      const tempPath: string[] = [...p];
      let top: any = tempPath.pop();
      while (tempPath.length > 0 && layerIsChecked(tempPath)) {
        const tempKeys = new Set(Object.keys(getCurrentList(tempPath)));
        top = tempPath.pop();
        if (firstLayer.has(top)) {
          currTags.push(`All ${top}s`);
        } else {
          currTags.push(top);
        }
        currTags = currTags.filter((key) => !tempKeys.has(key));
      }
    } else {
      const emp: Object[] = [];
      const flattenedObj = Object.assign(
        {},
        ...(function flatten(o: any): Object[] {
          return emp.concat(
            ...Object.keys(o).map((k) => {
              if (typeof o[k] === 'boolean') {
                return { [k]: 'temp' };
              }
              return [...flatten(o[k]), { [k]: 'temp' }];
            }),
          );
        })(currList[item]),
      );
      const itemsBelow = new Set(Object.keys(flattenedObj));
      currTags = currTags.filter((it) => !itemsBelow.has(it));
      currTags.push(item);
    }
    setTags({ ...tags, [type]: currTags });
  };

  const handleItemClickForward = (item: string, p: string[]) => {
    setPath([...p, item]);
    setCurrent(item);
    checkIsLast(item, p);
    return getCurrentList(p);
  };

  const handleItemClickBack = () => {
    setSearch('');
    setSearchResults([]);
    const temp = path;
    temp.pop();
    setPath(temp);
    setCurrent(path[path.length - 1]);
  };

  const handleItemCheck = (item: string, p: string[]) => {
    const tempOptions = filterOptions;
    let val: any = tempOptions;
    for (let i = 0; i < p.length; i += 1) {
      val = val[p[i]];
    }
    if (typeof val[item] === 'boolean') {
      val[item] = !val[item];
      setFilterOptions(tempOptions);
    } else if (checkChildrenTrue(p, item)) {
      selectAllChildren(item, false, p);
    } else {
      selectAllChildren(item, true, p);
    }
    addTag(item, p);
    setChange(!change);
  };

  const handleChipDelete = (item: string, type: string) => {
    let p: string[] = [];
    if (item === `All ${type}s`) {
      setTags({ ...tags, [type]: [] });
      handleItemCheck(type, p);
    } else {
      setTags({ ...tags, [type]: tags[type].filter((it: any) => it !== item) });
      p = findPath(item);
      handleItemCheck(item, p);
    }
  };

  return (
    <div>
      <Drawer
        variant="permanent"
        sx={{
          width: 400,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 400,
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
          {isLoading && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '20px',
              }}
            >
              <CircularProgress />
            </div>
          )}
          <List sx={{ margin: '0px', padding: '0px' }}>
            <div>
              {path.length > 0 && (
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
                    onClick={handleItemClickBack}
                  >
                    <ArrowBack />
                    <span style={{ marginLeft: '10px' }}>{current}</span>
                  </ListItemButton>
                </ListItem>
              )}
              <div style={{ overflow: 'none' }}>
                {Object.keys(tags).map((key) => (
                  <div
                    style={
                      tags[key].length > 0
                        ? {
                            overflow: 'auto',
                            scrollbarWidth: 'none',
                            whiteSpace: 'nowrap',
                            marginTop: '8px',
                            paddingBottom: '2px',
                          }
                        : {
                            overflow: 'auto',
                            scrollbarWidth: 'none',
                            whiteSpace: 'nowrap',
                            marginTop: '2px',
                          }
                    }
                  >
                    {tags[key].map((item: any) => (
                      <Chip
                        sx={{
                          margin: '0px 2px',
                        }}
                        color="primary"
                        label={item}
                        variant="outlined"
                        onDelete={() => {
                          handleChipDelete(item, key);
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              {path.length > 0 && countNodes(path) > 10 && (
                <div style={{ width: '100%', margin: 'auto' }}>
                  <SearchComponent
                    name={`${
                      current.substring(0, 1) +
                      current.substring(1).toLowerCase()
                    }`}
                    search={search}
                    handleChange={(value) => {
                      handleSearchChange(value);
                    }}
                  />
                </div>
              )}
            </div>
            {search.length === 0 &&
              Object.keys(getCurrentList(path, true)).map((curr) => (
                <ListItem
                  sx={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.1' }}
                  key={curr}
                  disablePadding
                >
                  {path.length > 0 && (
                    <Checkbox
                      checked={
                        change
                          ? isItemChecked(curr, path)
                          : isItemChecked(curr, path)
                      }
                      onChange={() => {
                        handleItemCheck(curr, path);
                      }}
                    />
                  )}
                  <ListItemButton
                    onClick={() => {
                      if (!checkIsLast(curr, path)) {
                        handleItemClickForward(curr, path);
                      } else {
                        handleItemCheck(curr, path);
                      }
                    }}
                  >
                    <ListItemText primary={curr}>{curr}</ListItemText>
                    {!checkIsLast(curr, path) && <ChevronRight />}
                  </ListItemButton>
                </ListItem>
              ))}
            {search.length > 0 && searchResults.length === 0 && (
              <p style={{ color: 'gray', textAlign: 'center' }}>
                No results found.
              </p>
            )}
            {search.length > 0 &&
              searchResults.length > 0 &&
              searchResults.map((curr) => (
                <ListItem
                  sx={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.1' }}
                  key={curr}
                  disablePadding
                >
                  {path.length > 0 && (
                    <Checkbox
                      checked={
                        change
                          ? isItemChecked(curr, findPath(curr))
                          : isItemChecked(curr, findPath(curr))
                      }
                      onChange={() => {
                        handleItemCheck(curr, findPath(curr));
                      }}
                    />
                  )}
                  <ListItemButton
                    onClick={() => {
                      if (!checkIsLast(curr, findPath(curr))) {
                        setSearch('');
                        setSearchResults([]);
                        handleItemClickForward(curr, findPath(curr));
                      } else {
                        handleItemCheck(curr, findPath(curr));
                      }
                    }}
                  >
                    <ListItemText primary={curr}>{curr}</ListItemText>
                    {!checkIsLast(curr, findPath(curr)) && <ChevronRight />}
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}

export default Filters;
