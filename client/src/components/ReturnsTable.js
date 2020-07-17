import React, { useState } from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

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

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
  },
});

function ReturnsTable(returnable) {
  const [message, setMessage] = useState(null);

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }
    return (
      <div>
        <Alert severity="error">{message}</Alert>
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
  const curData = returnable.returnable.data;

  return (
    <div>
      <h1> Products Eligible for Return </h1>

      {curData === "Transaction is outside 30 day return period." ? (
        <Notification message={curData} />
      ) : null}
      {curData === "Product was on sale so it cannot be returned." ? (
        <Notification message={curData} />
      ) : null}

      {curData !== undefined &&
      curData !== "Transaction is outside 30 day return period." &&
      curData !== "Product was on sale so it cannot be returned." ? (
        <Styles>
          <Table columns={columns} data={curData} />
        </Styles>
      ) : null}
    </div>
  );
}

export default ReturnsTable;
