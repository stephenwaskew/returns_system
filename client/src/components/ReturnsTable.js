import React, { useState } from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Collapse } from "@material-ui/core";

const Styles = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  table {
    border-spacing: 0;
    border: 1px solid white;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid white;
      border-right: 1px solid white;
      color: white;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            console.log("row, i", row, i);
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    marginBottom: "10px",
  },
}));

function ReturnsTable(returnable) {
  const [message, setMessage] = useState(null);
  const [open, setOpen] = React.useState(true);
  const [thirtyDaysOpen, setThirtyDaysOpen] = React.useState(true);

  const classes = useStyles();

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }
    return (
      <div>
        {message.prods.map((product) =>
          product.onsale == true ? (
            <div className={classes.root}>
              <Collapse in={open}>
                {" "}
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  key={product.id}
                  severity="error"
                >
                  Product {product.id} was on sale so it can't be returned
                </Alert>
              </Collapse>
            </div>
          ) : (
            <div className={classes.root}>
              <Collapse in={thirtyDaysOpen}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setThirtyDaysOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  key={product.id}
                  severity="error"
                >
                  Product id: {product.id} was purchased outside the 30 days
                  return period.
                </Alert>
              </Collapse>
            </div>
          )
        )}
      </div>
    );
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Returns",
        columns: [
          {
            Header: "ID",
            accessor: "id",
          },
          {
            Header: "Company",
            accessor: "company",
          },
        ],
      },
    ],
    []
  );
  const curStatus = returnable.returnable.status;
  const curData = returnable.returnable.data;
  console.log(returnable.returnable);
  console.log("curdata", curData, curStatus);
  return (
    <div>
      <h1> Products Eligible for Return </h1>

      {curStatus === 202 ? <Notification message={curData} /> : null}

      {curData !== undefined && curStatus !== 202 ? (
        <Styles>
          <Table columns={columns} data={curData} />
        </Styles>
      ) : null}
    </div>
  );
}

export default ReturnsTable;
