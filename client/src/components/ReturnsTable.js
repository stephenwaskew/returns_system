import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import { Collapse } from "@material-ui/core";
import { useStateMachine } from "little-state-machine";
import updateAction from "./updateAction";

import { StateMachineProvider, createStore } from "little-state-machine";
import transactionService from "../services/transactionServices";



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
  const [count, setCount] = useState(0);
  const [open, setOpen] = React.useState(true);
  const [thirtyDaysOpen, setThirtyDaysOpen] = React.useState(true);
  const [localData, setLocalData] = React.useState(null)
 
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
  }, []);


  /*
  useEffect(async () => {
    const currentDate = getCurrentDate();
    const fetchData = async () => {
      const result = await transactionService.getReturns(
        state.data.transactionID,
        currentDate
      ); 

      setData(result);
    };

    fetchData();
  }, []);
 */
  const getApi = async () => {
    console.log('the resultaaaa')

    const currentDate = getCurrentDate();
    console.log('the resultaaaa', currentDate)
    const result = await transactionService.getReturns(
      state.data.transactionID,
      currentDate
    ); 
    // console.log('the resultaaaa', result)
    // setData(result.data);
  };
 
  const currentDate = getCurrentDate();

  // console.log('the state222: ', state, props, data.prods)

  // console.log('returns: ', returnable, localData)
  useEffect(() => {
    document.title = `You clicked ${count} times`;
    //showTable(localData.returnable)
  });

 
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
    console.log('hereeeeaaa', returnable)
    if (returnable !== null && returnable !== undefined) {
      if (returnable.status == 200) {
        return (
     
        <Styles>
          <Table columns={columns} data={returnable.data}/>
        </Styles>

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

    {console.log('123456', data)}
    {(data.length !== 0 ? showTable(data): null)}
</div>
  );
}

export default ReturnsTable;


// {showTable(localData.returnable)}

//     {getApi()}
