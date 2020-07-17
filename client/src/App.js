import React, { useState } from "react";
import "./App.css";
import transactionService from "./services/transactionServices";
import TransactionForm from "./components/TransactionForm";
import ReturnsTable from "./components/ReturnsTable";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { StateMachineProvider, createStore } from "little-state-machine";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

// Use this function to get Current Date
function getCurrentDate() {
  return "2020-06-20T12:27:40 +04:00";
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

createStore({
  data: {},
});

function App() {
  const [returnable, setReturnable] = useState(false);
  const [message, setMessage] = useState(null);

  const classes = useStyles();
  const getReturnable = async (transactionObject) => {
    const currentDate = getCurrentDate();
    const allData = await transactionService.getReturns(
      transactionObject,
      currentDate
    );
    setReturnable(allData);
  };

  return (
    <div className="App">
      <StateMachineProvider>
        <Router>
          <Route
            exact
            path="/"
            component={() => <TransactionForm transactions={getReturnable} />}
          />
          <Route
            exact
            path="/returns"
            component={() => <ReturnsTable returnable={returnable} />}
          />
        </Router>
      </StateMachineProvider>
    </div>
  );
}

export default App;
