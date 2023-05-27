/* eslint-disable react/jsx-props-no-spreading */
/* eslint react/prop-types: 0 */
/* eslint-disable react/jsx-no-bind */

import React, { useState } from 'react';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ArrowUpward } from '@material-ui/icons';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { updateHierarchy } from './api';

/**
 * interface for the props of the {@link ViewHierarchyTable} component
 * @param columns An {@link Array} of type TColumn
 * @param rows An {@link Array} of type TRow
 */
interface TableProps {
  rows: TRow[];
  setRows: (r: any) => void;
  email: string;
  hierarchyId: string;
}

interface RowProps {
  row: TRow;
  index: number;
  updateRowItems: (a: TRow) => void;
  updateItem: (r: TRow, oldI: number, index: number) => void;
}

/**
 * This column interface defines the properties necessary for each column in a table.
 * The align and minWidth props are specific to the MUI Table Cell component.
 */
interface TColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
}

/**
 * This row interface defines the properties necessary for each row in a table. Namely, each row object must have a unique key and a properties mapping each column id to a value.
 */
interface TRow {
  key: string;
  no: number;
  itemName: string;
  suds: string;
}

/**
 * Our pagination table is set up by passing in a row component for each row.
 * This is the row component for a table of users.
 * @param row - a object type containing a unique key for the row and props mapping each column id to a value. If the column id is not present, the corresponding cell will be empty
 * @returns User Row component, to be used in a user-specific pagination table.
 */
function Row({ row, index, updateItem, updateRowItems }: RowProps) {
  return (
    <TableRow hover tabIndex={-1} key={`${row.key}TR`}>
      <TableCell
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '800px',
          margin: '0px 5px',
          alignItems: 'center',
        }}
      >
        <span style={{ marginRight: '7%' }}>{index + 1}</span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
          }}
        >
          <span>{row.itemName}</span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '21.2%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TextField
              variant="standard"
              sx={{ width: '50px' }}
              size="small"
              value={row.suds}
              type="number"
              inputProps={{
                min: 0,
                style: { textAlign: 'center' },
              }}
              onChange={(event) => {
                updateItem(
                  {
                    key: `${row.key}`,
                    no: row.no,
                    itemName: row.itemName,
                    suds: event.target.value,
                  },
                  row.no,
                  index,
                );
              }}
            />

            <IconButton onClick={() => updateRowItems(row)}>
              <DeleteIcon sx={{ color: '#474747' }} />
            </IconButton>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

const reorder = (list: TRow[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * @param rows - an array of TRow objects that define the rows of the table. They each have props which map column ids to values for that row.
 */
function ViewHierarchyTable({ rows, setRows, email, hierarchyId }: TableProps) {
  const updateRowItems = (row: TRow) => {
    // deleting row
    const tempRows = rows.filter((it) => {
      return it.key !== row.key;
    });
    setRows(tempRows);
    const toEdit: [string, string, string][] = tempRows.map((r) => [
      r.itemName,
      r.no.toString(),
      r.suds,
    ]);
    updateHierarchy(email, hierarchyId, undefined, undefined, toEdit);
  };

  const updateItem = (row: TRow, oldI: number, index: number) => {
    // changing suds
    let temp = rows;
    temp = temp.filter((it) => it.no !== oldI);
    temp.splice(index, 0, row);
    setRows(temp);
    const toEdit: [string, string, string][] = temp.map((r) => [
      r.itemName,
      r.no.toString(),
      r.suds,
    ]);
    updateHierarchy(email, hierarchyId, undefined, undefined, toEdit);
  };

  function onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    // reordering the rows
    const reorderedItems: TRow[] = reorder(
      rows,
      result.source.index,
      result.destination.index,
    );
    setRows(reorderedItems);
    const toEdit: [string, string, string][] = reorderedItems.map((r) => [
      r.itemName,
      r.no.toString(),
      r.suds,
    ]);
    updateHierarchy(email, hierarchyId, undefined, undefined, toEdit);
  }

  const sortBySuds = () => {
    const newRows = [...rows];
    newRows.sort((a, b) => {
      if (a.suds === '' && b.suds === '') {
        return 0;
      }
      if (a.suds === '') {
        return 1;
      }
      if (b.suds === '') {
        return -1;
      }
      return Number(a.suds) - Number(b.suds);
    });
    setRows(newRows);
    const toEdit: [string, string, string][] = newRows.map((r) => [
      r.itemName,
      r.no.toString(),
      r.suds,
    ]);
    updateHierarchy(email, hierarchyId, undefined, undefined, toEdit);
  };

  return (
    <Paper
      sx={{
        width: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 'auto',
      }}
    >
      <TableContainer sx={{ flexGrow: 1, flexShrink: 1 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <span style={{ marginRight: '5%' }}>No.</span>
                  <div
                    style={{
                      width: '80%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Item Name</span>
                    <div>
                      <span>SUDS</span>
                      <IconButton onClick={sortBySuds}>
                        <ArrowUpward />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ width: '100%' }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ width: '100%' }}
                  >
                    {rows.map((row, index) => (
                      <Draggable
                        key={row.key}
                        draggableId={row.key}
                        index={index}
                      >
                        {(p, s) => {
                          return (
                            <div
                              ref={p.innerRef}
                              {...p.draggableProps}
                              {...p.dragHandleProps}
                            >
                              <Row
                                updateRowItems={(r) => updateRowItems(r)}
                                updateItem={updateItem}
                                row={row}
                                index={index}
                                key={row.key}
                              />
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export { ViewHierarchyTable };
export type { TRow, TColumn };
