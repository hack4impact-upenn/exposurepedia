import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

/**
 * interface for the props of the {@link PaginationTable} component
 * @param columns An {@link Array} of type TColumn
 * @param rows An {@link Array} of type TRow
 */
interface TableProps {
  rows: TRow[];
  columns: TColumn[];
}

interface RowProps {
  row: TRow;
  columns: TColumn[];
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
function Row({ row, columns }: RowProps) {
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

  console.log(row);
  return (
    <TableRow hover tabIndex={-1} key={`${row.key}TR`}>
      {columns.map((column) => {
        const value = row[column.id];
        console.log(value);
        if (value === null || value === undefined) {
          return null;
        }
        return (
          <TableCell
            className={classes.tableRow}
            key={column.id + row.key}
            align={column.align || 'left'}
          >
            {value}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

/**
 * @param columns - an array of TColumn objects that define the columns of the table. Each column has a display name (the prop is label) and an id prop used to link with the rows array.
 * @param rows - an array of TRow objects that define the rows of the table. They each have props which map column ids to values for that row.
 */
function ViewHierarchyTable({ rows, columns }: TableProps) {
  return (
    <Paper
      sx={{
        width: '80%',
        height: '100%',
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
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return <Row row={row} key={row.key} columns={columns} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export { ViewHierarchyTable };
export type { TRow, TColumn };
