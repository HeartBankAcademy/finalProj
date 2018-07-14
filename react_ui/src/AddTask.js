import React, { Component } from 'react';
import web3 from './web3';
import ipfs from './ipfs';

class AddTask extends Component{
    constructor(props) {
        super(props);

        this.state = {
          taskId: null,
          imgIpfsHash: null,
          imgBuffer: '',
          ipfsHash: null,
          transactionHash: ''
        }

        this.captureFile = this.captureFile.bind(this);
        this.convertToBuffer = this.convertToBuffer.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addJSONToIpfs = this.addJSONToIpfs.bind(this);
    }

    //read the file. then convert it to buffer line by line (array)
    async captureFile(event) {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
    
        let reader = await new window.FileReader(); 
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.convertToBuffer(reader) 
    }   
    //file(img) is converted to a buffer
    async convertToBuffer(reader) {        
        const buffer = await Buffer.from(reader.result);       
        this.setState({imgBuffer : buffer});
    }
    //add a json obj called "doc" to ipfs and add its hash to ethereum.Also get its taskId
    async addJSONToIpfs(doc) {
        const buf = await Buffer.from(JSON.stringify(doc));
       
        await ipfs.add(buf, (err,files) => {            
            console.log(err,files);
            let _ipfsHash = files[0].hash;
            
            //add the ipfsHash to ethereum!
            const {addHash} = this.props.contractInstance;
            addHash(_ipfsHash, (err, transHash) => {
                this.setState({
                    transactionHash: transHash,
                    ipfsHash: _ipfsHash
                });
            });

            //get your task id
            const {getLatestTaskId} = this.props.contractInstance;
            getLatestTaskId((err, id) => {
                id = id.toNumber()+1;
                this.setState({taskId: id});  //+1 problem
            });           
        })
    }
    //create the correct json object to add to ipfs.
    async handleSubmit(e) {
        e.preventDefault();        

        //get task description, deadline, reward
        let _taskDesc = document.querySelector('input[name=taskDesc]').value;
        let _deadline = document.querySelector('input[name=deadline]').value;
        let _reward = document.querySelector('input[name=reward]').value;
        let _imgIpfsHash = null;

        //create JSON obj
        const doc = {
            descriptionOfTask: _taskDesc, 
            rewardYouEarn: _reward  + ' finney',
            deadline: _deadline, 
            IpfsHashOfImageUploaded: _imgIpfsHash
        };

        this.setState({ 
            ipfsHash: 'awaiting',
            transactionHash: 'awaiting'
        });

        //add image to ipfs if imgBuffer is not an empty string:
        if (this.state.imgBuffer!='') {
            await ipfs.add(this.state.imgBuffer, (err,files) => {
                console.log(err,files[0]);
                _imgIpfsHash = files[0].hash;
                doc.IpfsHashOfImageUploaded = _imgIpfsHash;  
                this.addJSONToIpfs(doc);              
            });
            this.state.imgBuffer = ''; //set it back to null.           
        } else { //go ahead with no image:
            await this.addJSONToIpfs(doc);
        }
    }
	
	render() {
		return (
      <div className="AddTask">
        <header className="header">
          <h1 id="addTask" className="title">Add Task Details. Then Store in IPFS and in Ethereum and Give you Task Id!</h1>
        </header>
        <br />
        <form onSubmit = { this.handleSubmit }>
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
          onChange = {this.captureFile} />
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
              <td>{this.state.taskId}</td>
            </tr>
            <tr>
              <td>IPFS Hash # of the task (also stored on Eth Contract)</td>
              <td>{this.state.ipfsHash}</td>
            </tr>
            <tr>
                <td>Ethereum Tx Hash # </td>
                <td>{this.state.transactionHash}</td>
              </tr>
          </tbody>
        </table>
      </div>
    )}
}

export default AddTask;