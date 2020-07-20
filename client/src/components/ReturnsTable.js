import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import { Collapse } from "@material-ui/core";
import { useStateMachine } from "little-state-machine";
import updateAction from "./updateAction";
import transactionService from "../services/transactionServices";
import CloseIcon from '@material-ui/icons/Close';

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
  // state and functions to get the table ready
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

  // create the table itself along with logic for multiple company policies
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


const ReturnsTable = props => {
  const { state } = useStateMachine(updateAction);
  const [open, setOpen] = React.useState(true);
  const [thirtyDaysOpen, setThirtyDaysOpen] = React.useState(true);
 
  const [data, setData] = useState([] );
  // Use this function to get Current Date
  function getCurrentDate() {
    return "2020-06-20T12:27:40 +04:00";
  }
 
  const fetchData = async () => {
    const currentDate = getCurrentDate();
    const result = await transactionService.getReturns(
      state.data.transactionID,
      currentDate
    ); 
    setData(result);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }
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
                 <CloseIcon />
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
                <CloseIcon />
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
    if (returnable !== null && returnable !== undefined) {
      if (returnable.status === 200) {
        return (
        <Styles>
          <Table columns={columns} data={returnable.data}/>
        </Styles>
        )     
      }

      if (returnable.status === 202) {
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
    {(data.length !== 0 ? showTable(data): null)}
</div>
  );
}

export default ReturnsTable;


