import React, { Component } from 'react';
import './App.css';
import AddTask from './AddTask';
import ViewTask from './ViewTask';

class App extends Component {
  constructor(props) {
    super(props);

    const contractABI = window.web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"child","type":"address"}],"name":"addChildren","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_ipfsHash","type":"string"}],"name":"addHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLatestTaskId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getCorrespondingHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]
    ); //abi

    this.state = {
        contractInstance: contractABI.at('0xae28e70141caf7d5cd963df148c8786b24d37d3c') //addr
     }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Assign Task to your kids!</h1>
        </header>  
        
        <ul>
          <li><a href="#addChildren">Add Children</a></li>
          <li><a href="#addTask">Add Task</a></li>
          <li><a href="#viewTask">View a Task</a></li>
          <li><a href="#logCompleted">Log a task as completed</a></li>
          <li><a href="#verifyCompleted">Verify that a task is completed</a></li>
        </ul>      
        <hr />
        <AddTask id="addTask" contractInstance={this.state.contractInstance}/>
        <ViewTask id="viewTask" contractInstance={this.state.contractInstance}/>
        
      </div>
    );
  }
}

export default App;
