import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Add Details. Store in IPFS and in Ethereum!</h1>
        </header>

        <form onSubmit = { this.props.onSubmit }>
          <input
            type = "text"
            //value = {this.props.}
            placeholder = "Describe the task"
            onChange = { this.props.onDescribeChange}
          />

          <br />
          <br />

          <p>Enter the reward you are willing to give in FINNEY (1 ETHER = 100 FINNEY)  </p>
          <input
            type = "text"
            //value = {this.props.}
            placeholder = "reward"
            onChange = { this.props.onRewardChange}
          />

          <br />
          <br />

          <input 
            type = "text"
            //value
            placeholder = "deadline"
            onChange = { this.props.onDeadlineChange}
          />
          
          <br/>
          <br/>
          
          <p> If you want to add an image associated to your task: </p>
          <input
            type = "file"
            accept = "image/*"
            onChange = { this.props.onImageChange}
          />
          
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
              <td>IPFS Hash # stored on Eth Contract</td>
              <td>{this.props.ipfsHash}</td>
            </tr>
          </tbody>
        </table>
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

gender
ipfsHash
*/
