import React, { Component } from 'react';
import contractInstance from './utils/contractSetup';
import './App.css';
import ShowTasks from './Views/ShowTasks';
import AddChildren from './Views/AddChildren';
import AddTask from './Views/AddTask';
import ViewTask from './Views/ViewTask';
import DoingTask from './Views/DoingTask';
import CompletedTask from './Views/CompletedTask';
import VerifyTask from './Views/VerifyTask';

class App extends Component {
  /*constructor(props) {
    super(props);

    const contractABI = window.web3.eth.contract(
      [{"constant":true,"inputs":[],"name":"task_id","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getLatestTaskId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"id_to_task","outputs":[{"name":"ipfsHash","type":"string"},{"name":"childDoing","type":"address"},{"name":"parent","type":"address"},{"name":"completed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"parent_to_children","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getCorrespondingTask","outputs":[{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ipfsHash","type":"string"}],"name":"addTask","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"child","type":"address"}],"name":"addChildren","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_taskId","type":"uint256"}],"name":"doingATask","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"completedATask","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"verifyTask","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]
    ); //abi

    this.state = {
        contractInstance: contractABI.at('0x1ad592e252d239351904bc722427e38ec02b9ae3') //addr
     }
  }*/

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Assign Task to your kids!</h1>
        </header>  
        
        <p>Welcome! Here are the steps to add a task, and leave your children to do, without the hassle of you having to continuously repeat the tasks! </p>
        <p>Before we go ahead,<strong>ensure that you have metamask installed! And there may be alerts popping up if you are doing something wrong</strong>(such as verifying the wrong task etc)</p>
        
        <ul>
          <li><a href="#instructions">Instructions/ How to use</a></li>
          <li><a href="#addChildren">Add Children</a></li>
          <li><a href="#addTask">Add Task</a></li>
          <li><a href="#viewTask">View a Task</a></li>
          <li><a href="#logDoing">Confirm Doing a Task </a></li>
          <li><a href="#logCompleted">Confirm a Task as Completed</a></li>
          <li><a href="#verifyCompleted">Verify a Task is Completed</a></li>
        </ul>      
        <hr />

        <h4 id="instructions"> For parents: </h4>
        <p>First, add the children accounts (their ethereum addresses). You don't need to add an account that you have already added!
          <br/> 
          Second, add the task!
          Now you may tell your kids the task ids.
          If they have completed the task, and have confirmed so on the system,then you can "verify the task". If the task has been completed to your liking, simply go to <strong>"Verify a Task is Completed"</strong> section. In the metamask pop-up, you shall see that "amount" field is the reward for the task set :)
        </p>
        <h4> For kids/task do-ers: </h4>
        <p>"View Task" - enter the task id that your parent may have given to you! If the task (and its reward) is to your liking, please go to <strong>"Confirm Doing a Task section"</strong>.
        Once your task is complete, please go to <strong>"Confirm a Task as Completed"</strong> section.
        Finally, wait for your parent to verify the task so you can get paid!
        </p>

	    <ShowTasks id="showTasks" contractInstance={contractInstance}/>
        <AddChildren 
        id="addChildren" contractInstance={contractInstance}/>
        <AddTask id="addTask" contractInstance={contractInstance}/>
        <ViewTask id="viewTask" contractInstance={contractInstance}/>
        <DoingTask id="logDoing"contractInstance={contractInstance}/>
        <CompletedTask id="logCompleted"contractInstance={contractInstance}/>
        <VerifyTask id="verifyCompleted"contractInstance={contractInstance}/>  
      </div>
    );
  }
}

export default App;

