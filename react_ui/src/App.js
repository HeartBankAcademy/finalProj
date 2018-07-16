import React, { Component } from 'react';
import './App.css';
import AddChildren from './AddChildren';
import AddTask from './AddTask';
import ViewTask from './ViewTask';

class App extends Component {
  constructor(props) {
    super(props);

    const contractABI = window.web3.eth.contract(
      [{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"parent_to_children","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ipfsHash","type":"string"},{"name":"payment","type":"uint256"}],"name":"addTask","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"child","type":"address"}],"name":"addChildren","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_taskId","type":"uint256"}],"name":"doingATask","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"completedATask","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"verifyTask","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getLatestTaskId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getCorrespondingTask","outputs":[{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]
    ); //abi

    this.state = {
        contractInstance: contractABI.at('0xf5a9eae0c325d1665149307ca9c87c8b7b613ccf') //addr
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
        <AddChildren 
        id="addChildren" contractInstance={this.state.contractInstance}/>
        <AddTask id="addTask" contractInstance={this.state.contractInstance}/>
        <ViewTask id="viewTask" contractInstance={this.state.contractInstance}/>

      </div>
    );
  }
}

export default App;


