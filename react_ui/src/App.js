import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    let table;
    if(this.props.showTaskId) {
      table = <table border = "1">
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
      </table>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Add Details. Store in IPFS and in Ethereum!</h1>
        </header>
        <br/>
        <br/>
        <form onSubmit = { this.props.onSubmit }>
          Describe the task:   
          <input
            type = "text"
            name = "taskDesc"
            //value = {this.props.}
            placeholder = "Description"
            //onChange = { this.props.onDescribeChange}
          />

          <br />
          <br />

          The reward you are willing to give in FINNEY (1 ETHER = 1000 FINNEY)
          <input
            type = "text"
            name = "reward"
            //value = {this.props.}
            placeholder = "reward"
            //onChange = { this.props.onRewardChange}
          />

          <br />
          <br />
          By when should the task be completed by: 
          <input 
            type = "text"
            name = "deadline"
            //value
            placeholder = "deadline"
            //onChange = { this.props.onDeadlineChange}
          />
          
          <br/>
          <br/>
          
          If you want to add an image associated to your task:
          <input
            type = "file"
            accept = "image/*"
            onChange = { this.props.onImageChange }
          />

          <br/>
          <br/>
          
          <button type="submit" > Submit </button> 
        </form>

        <h4> Displaying relevant details of the transaction </h4>
        <table border = "1">
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

      </div>
    );
  }
}

export default App;

/*
App.propTypes = 
onSubmit
onDescribeChange
onRewardChange
onDeadlineChnage
onImageChange
onClick
onSubmitTaskId

taskId
taskDesc
reward
deadline
ipfsHash
imgIpfsHash
transactionHash
showTaskId
*/


//DISPLAY THIS USING INFURA IPFS API on pressing getTransactionDetails BUTTON????????????!
/*
            <tr>
              <td>IPFS Hash # of the task (also stored on Eth Contract)</td>
              <td>{this.props.ipfsHash}</td>
            </tr>

            <tr>
              <td>Tx Hash # </td>
              <td>{this.props.transactionHash}</td>
            </tr>

            <tr>
              <td>Block Number # </td>
              <td>{this.props.blockNumber}</td>
            </tr>

            <tr>
              <td>Gas Used</td>
              <td>{this.props.gasUsed}</td>
            </tr>
*/
