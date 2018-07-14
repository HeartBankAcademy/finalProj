import React, { Component } from 'react';

class AddViewTask extends Component {
  render() {
    //Add task form
    //Display transaction details
    //View a task
    //view task table - render only if someone wants to view task.
    
    let table;
    if(this.props.showTaskId) {
      table = <div>
        <table border = "1">
        <tbody>
          <tr>
            <th>Task Detail Categories</th>
            <th>Values </th>
          </tr>
          <tr>
            <td>What is needed to be done:</td>
            <td>{this.props.taskDesc}</td>
          </tr>

          <tr>
            <td>Do the task by:</td>
            <td>{this.props.deadline}</td>
          </tr>

          <tr>
            <td>Reward (in finney)</td>
            <td>{this.props.reward}</td>
          </tr>

          <tr>
            <td>ipfs hash of the image (if available)</td>
            <td>{this.props.imgIpfsHash}</td>
          </tr>
        </tbody>
      </table>
      <p>NOTE: To see the image: go to gateway.ipfs.io/ipfs/(the hash)</p>
    </div>
    }
    
    let error;
    if(this.props.showError) {
      error = <p>You may have entered either an invalid task id, or a task id that doesn't belong to you. Try again!</p>;
    }

    return (
      <div className="AddViewTask">
        <header className="header">
          <h1 className="title">Add Task Details. Then Store in IPFS and in Ethereum and Give you Task Id!</h1>
        </header>
        <br/>
        <br/>
        <form onSubmit = { this.props.onSubmit }>
          Describe the task:   
          <input type = "text" name = "taskDesc" placeholder = "Description" />
          <br />
          <br />
          The reward you are willing to give in FINNEY (1 ETHER = 1000 FINNEY)
          <input type = "text" name = "reward" placeholder = "reward" />
          <br />
          <br />
          By when should the task be completed by: 
          <input type = "text" name = "deadline" placeholder = "deadline" />
          <br/>
          <br/>          
          If you want to add an image associated to your task:
          <input type = "file" accept = "image/*" 
          onChange = { this.props.onImageChange } />
          <br/>
          <br/>
          <button type="submit" > Submit </button> 
        </form>

        <h4> Displaying relevant details of the transaction </h4>
        <table className="table" border = "1">
          <tbody>
            <tr>
              <th>Transaction Receipt Category </th>
              <th>Values </th>
            </tr>
          
            <tr>
              <td>Task id</td>
              <td>{this.props.taskId}</td>
            </tr>
            <tr>
              <td>IPFS Hash # of the task (also stored on Eth Contract)</td>
              <td>{this.props.ipfsHash}</td>
            </tr>
            <tr>
                <td>Ethereum Tx Hash # </td>
                <td>{this.props.transactionHash}</td>
              </tr>
          </tbody>
        </table>

        <hr />
        
        <h4> Get task information by entering a task id </h4>
        <form onSubmit = {this.props.onSubmitTaskId}>
          <input type="text" placeholder="enter task id" name="task_id"/>
          <input type="submit" />
        </form>

        {table}
        {error}
      </div>
    );
  }
}

export default AddViewTask;