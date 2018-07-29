import React, { Component } from 'react';
import contractInstance from './utils/contractSetup';
import './App.css';
import GetTasks from './Views/GetTasks';
import AddChildren from './Views/AddChildren';
import AddTask from './Views/AddTask';
import ViewTask from './Views/ViewTask';
import DoingTask from './Views/DoingTask';
import CompletedTask from './Views/CompletedTask';
import VerifyTask from './Views/VerifyTask';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Assign, See and Do Tasks!</h1>
        </header>  
        
        <p>Welcome! Here are the steps to add a task, assign it to the right people, 
		without the hassle of you having to remind them! </p>
        <p>Before we go ahead,<strong>ensure that you have metamask installed! 
		And there may be alerts popping up if you are doing something wrong
		</strong>(such as verifying the wrong task etc)</p>
        
        <ul>
          <li><a href="#instructions">Instructions/ How to use</a></li>
		  <li><a href="#showTasks">See your tasks</a></li>
          <li><a href="#addChildren">Add Task Do-ers</a></li>
          <li><a href="#addTask">Add Task</a></li>
          <li><a href="#viewTask">View a Task</a></li>
          <li><a href="#logDoing">Confirm Doing a Task </a></li>
          <li><a href="#logCompleted">Confirm a Task as Completed</a></li>
          <li><a href="#verifyCompleted">Verify a Task is Completed</a></li>
        </ul>      
        <hr />

        <h4 id="instructions"> For Task-Creators: </h4>
        <p>First, add the ethereum accounts (ethereum addresses) of those who can 
		do the tasks you assign. You don't need to add an account that you have already added!
        <br/> 
        Second, add the task!
        Now you give the task ids to those who should do the tasks.
        If they have completed the task, and have confirmed so on the system,
		then you must "verify the task". If the task has been completed to your liking, 
		simply go to <strong>"Verify a Task is Completed"</strong> section, enter the id 
	    and pay the amount. You have an option to change the initial agreed amount, 
		if you aren't satisfied with the task! </p>
        <h4> For task do-ers: </h4>
        <p>"View Task" - enter the task id that has been given to you! If the task 
		(and its reward) is to your liking, please go to <strong>"Confirm Doing a Task 
	    section"</strong>. Once your task is complete, please go to <strong>
	    "Confirm a Task as Completed"</strong> section. Finally, wait for the 
	    task to be verified (by the task-creator)  to get paid! </p>

	    <h4> ALSO...</h4>
	    <p> You can view all tasks that you have created or doing in the <strong>
	    See your Tasks </strong> section. The tasks will be divided in 5 tables, based 
	    on if the task was completed, verified and other parameters. </p>
	  
	    <GetTasks id="showTasks" contractInstance={contractInstance}/>
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

