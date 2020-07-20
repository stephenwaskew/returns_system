import React from "react";
import "./App.css";
import TransactionForm from "./components/TransactionForm";
import ReturnsTable from "./components/ReturnsTable";
import { Route, HashRouter } from "react-router-dom";
import { StateMachineProvider, createStore } from "little-state-machine";
import { DevTool } from 'little-state-machine-devtools';

createStore({
  data: {},
});

function App() {
  return (
    <div className="App">
      <StateMachineProvider>
        <DevTool />
        <HashRouter>
        <Route exact path="/" component={TransactionForm} />
        <Route path="/returns" component={ReturnsTable} />
        </HashRouter>
      </StateMachineProvider>
    </div>
  );
}

export default App;
