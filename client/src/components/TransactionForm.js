import React from 'react'
import { useForm } from 'react-hook-form'
import "./styles.css";
import updateAction from "./updateAction";
import { useStateMachine } from "little-state-machine";

import { BrowserRouter as Router, useHistory } from 'react-router-dom'


  const  TransactionForm = props => {

  const { register, handleSubmit, watch, errors } = useForm()
  const { action, state } = useStateMachine(updateAction);
  console.log('the state: ', state)
  // const history = useHistory()
  const onSubmit = data => {
    console.log('some data', data)
    action(data);
    //transactions({
    //    transactionID: props.data.transactionID
    //})
   props.history.push('/returns')
  } 
  // limit user input to only numbers between 0 and 5. It might be nice to do a lookup of length here to determine actual numbers dynamically.
  return (
    <div>
    <h1>Enter transaction id to check returnable product</h1>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name='transactionID'
        ref={register({
          validate: {
            positiveNumber: value => parseFloat(value) >= 0,
            lessThanSix: value => parseFloat(value) < 6
          }
        })}
        placeholder="Transacion id"
      />
      {errors.transactionID && errors.transactionID.type === "positiveNumber" && (
        <h1>Your transaction id is invalid. Please enter a number between 0 and 5 (inclusive).</h1>
      )}
      {errors.transactionID && errors.transactionID.type === "lessThanSix" && (
        <h1> Your transaction id must be between 0 and 5 </h1>
      )}
      <input type='submit' value='Submit' />
    </form>
    </div>
  )
}

export default TransactionForm
