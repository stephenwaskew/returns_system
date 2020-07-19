import React, { useState, useEffect} from "react";
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

  // Render the UI for the table.
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
            prepareRow(row);
            console.log('the cell: ', row.original.company[0].allowsReturns)
            return (
              (row.original.company[0].allowsReturns === "Yes" ?    <tr style={{backgroundColor: "green"}} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr> :
              <tr style={{backgroundColor: "red"}} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>)
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

  const [open, setOpen] = React.useState(true);
  const [thirtyDaysOpen, setThirtyDaysOpen] = React.useState(true);
  const [localData, setLocalData] = React.useState(returnable)


  const classes = useStyles();

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }
    console.log('the message: ', message)
    return (
      <div>
        {message.prods.map((product) =>
          product.onsale === true ? (
            <div key={product.id} className={classes.root}>
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
            <div key={product.id} className={classes.root}>
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

  // this is where the returns table can be expanded on. Just add the attributes of the value to be displayed.
  const columns = React.useMemo(
    () => [
      {
        Header: "Products",
        columns: [
          {
            Header: "ID",
            accessor: "id",
          },
          {
            Header: "Company",
            accessor: "company[0].companyName",
          },
          {
            Header: "Does Company Allow Returns?",
            accessor: "company[0].allowsReturns",
          },
        ],
      },
    ],
    []
  );

  // check if product is eligible for return based on its status and then display in the table
  const showTable = ( returnable ) => {
    console.log(returnable)
    if (returnable !== null) {
      if (returnable.status == 200) {
        return (
          <div>
        <Styles>
          <Table columns={columns} data={returnable.data}/>
        </Styles>
        </div>
        )     
      }

      if (returnable.status == 202) {
        return (
          <div>
          <Notification message={returnable.data} />
          </div>
        )
      }
    }
  }
     
  return (
    <div>
      <h1> Transaction Criteria </h1>
    <ul>
      <li><span>Occurred in the last 30 days</span></li>
      <li><span>Product is returnable</span></li>
      <li><span>Product is not on sale</span></li>
    </ul>
    {showTable(localData.returnable)}
</div>
  );
}

export default ReturnsTable;
