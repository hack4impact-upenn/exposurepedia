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
import { makeStyles } from '@mui/styles';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';

/**
 * interface for the props of the {@link PaginationTable} component
 * @param columns An {@link Array} of type TColumn
 * @param rows An {@link Array} of type TRow
 */
interface TableProps {
  rows: TRow[];
  setRows: (r: any) => void;
  columns: TColumn[];
}

interface RowProps {
  row: TRow;
  columns: TColumn[];
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
  [key: string]: any;
}

/**
 * Our pagination table is set up by passing in a row component for each row.
 * This is the row component for a table of users.
 * @param columns - an array of TColumn objects that define the columns of the table.
 * @param row  - a object type containing a unique key for the row and props mapping each column id to a value. If the column id is not present, the corresponding cell will be empty
 * @returns User Row component, to be used in a user-specific pagination table.
 */
function Row({ row, columns, index, updateItem, updateRowItems }: RowProps) {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const useStyles = makeStyles(() => ({
    tableRow: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }));
  const classes = useStyles();
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
        <span style={{ marginRight: '5%' }}>{index + 1}</span>
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
              width: '14.2%',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              variant="standard"
              sx={{ width: '50px' }}
              size="small"
              value={row.suds}
              inputProps={{ min: 0, style: { textAlign: 'center' } }}
              onChange={(event) => {
                updateItem(
                  {
                    key: `${row.no}`,
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
 * @param columns - an array of TColumn objects that define the columns of the table. Each column has a display name (the prop is label) and an id prop used to link with the rows array.
 * @param rows - an array of TRow objects that define the rows of the table. They each have props which map column ids to values for that row.
 */
function ViewHierarchyTable({ rows, columns, setRows }: TableProps) {
  const updateRowItems = (row: TRow) => {
    setRows(rows.filter((it) => it.key !== row.key));
  };

  const updateItem = (row: TRow, oldI: number, index: number) => {
    let temp = rows;
    temp = temp.filter((it) => it.no !== oldI);
    temp.splice(index, 0, row);
    setRows(temp);
  };

  function onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedItems: TRow[] = reorder(
      rows,
      result.source.index,
      result.destination.index,
    );

    setRows(reorderedItems);
  }

  return (
    <Paper
      sx={{
        width: '800px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 'auto',
        overflow: 'hidden',
      }}
    >
      <TableContainer sx={{ flexGrow: 1, flexShrink: 1, maxHeight: 400 }}>
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
                    <span>SUDS</span>
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
                    // style={getListStyle(snapshot.isDraggingOver)}
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
                              // style={getItemStyle(
                              //   snapshot.isDragging,
                              //   provided.draggableProps.style,
                              // )}
                            >
                              <Row
                                updateRowItems={(r) => updateRowItems(r)}
                                updateItem={updateItem}
                                row={row}
                                index={index}
                                key={row.key}
                                columns={columns}
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
