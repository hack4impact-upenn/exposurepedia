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
  Toolbar,
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
  isApprove: boolean;
  isBroken: boolean;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
}

interface RowProps {
  row: TRow;
  columns: TColumn[];
  isApprove: boolean;
  isBroken: boolean;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
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
  title: string;
  format: string;
  likes: number;
  date: string;
  [key: string]: any;
}

/**
 * Our pagination table is set up by passing in a row component for each row.
 * This is the row component for a table of users.
 * @param columns - an array of TColumn objects that define the columns of the table.
 * @param row  - a object type containing a unique key for the row and props mapping each column id to a value. If the column id is not present, the corresponding cell will be empty
 * @returns User Row component, to be used in a user-specific pagination table.
 */
function Row({ row, columns, isApprove, isBroken, setCount }: RowProps) {
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setCount) {
      if (checked) {
        setCount((count) => count - 1);
      } else {
        setCount((count) => count + 1);
      }
    }
    setChecked(event.target.checked);
  };
  const handleNavigate = () => {
    navigate('/exposureitem', {
      state: {
        key: row.key,
        title: row.title,
        format: row.format,
        likes: row.likes,
        date: row.date,
        isApprove,
        isBroken,
      },
    });
  };

  return (
    <TableRow role="checkbox" hover tabIndex={-1} key={`${row.key}TR`}>
      {!isApprove && !isBroken && (
        <TableCell style={{ width: '30px' }}>
          <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </TableCell>
      )}
      {columns.map((column) => {
        const value = row[column.id];
        if (value === null || value === undefined) {
          return null;
        }
        return (
          <TableCell
            onClick={() => handleNavigate()}
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
 * A pagination table component, mainly used in tables that require
 * multiple pages, for example the user tables in admin-view. This table will fill 100% of its parent container, so a wrapper should be added if you wish to constrain the table's width and height
 * @param columns - an array of TColumn objects that define the columns of the table. Each column has a display name (the prop is label) and an id prop used to link with the rows array.
 * @param rows - an array of TRow objects that define the rows of the table. They each have props which map column ids to values for that row.
 */
function ExposureItemTable({
  rows,
  columns,
  isApprove,
  isBroken,
  setCount,
}: TableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: '90%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '10px auto',
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <Row
                    row={row}
                    key={row.key}
                    columns={columns}
                    isApprove={isApprove}
                    isBroken={isBroken}
                    setCount={setCount}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ flexShrink: 0, flexGrow: 0 }}
      />
    </Paper>
  );
}

export { ExposureItemTable };
export type { TRow, TColumn };
