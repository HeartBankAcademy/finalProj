import React, { Component } from 'react';
import App from './App';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';

//const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");

class AppContainer extends Component{
    constructor(props) {
        super(props);

        const contractABI = window.web3.eth.contract(); //abi

        this.state = {
            contractInstance = contractABI.at(), //addr
            taskDesc: '',
            reward: '',
            deadline: '',
            imgIpfsHash: null,
            imgBuffer: '',
			bufferJSON: '',
            ipfsHash: null,
            transactionHash: ''
        }

        this.handleDescribeChange = this.handleDescribeChange.bind(this);
        this.handleRewardChange = this.handleRewardChange.bind(this);
        this.handleDeadlineChnage = this.handleDeadlineChnage.bind(this);
        this.captureFile = this.captureFile.bind(this);
        this.convertToBuffer = this.convertToBuffer.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleDescribeChange(e) {
        this.setState({
            taskDesc: e.target.value
        });
    }

    handleRewardChange(e) {
        this.setState({
            reward: e.target.value
        });
    }

    handleDeadlineChnage(e) {
        this.setState({
            deadline: e.target.value
        });
    }

    async captureFile(event) {
        event.stopPropagation();
        event.preventDefault();
		
        const file = event.target.files[0];
    
        let reader = await new window.FileReader(); //read the contents of files
        reader.readAsArrayBuffer(file); //read the file! When the read operation is finished, the readyState becomes DONE, and the loadend is triggered.
        reader.onloadend = () => this.convertToBuffer(reader) 
      }   
    
    async convertToBuffer(reader) {
        //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);       
        this.setState({imgBuffer : buffer});
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        //add image to ipfs:
        await ipfs.add(this.state.imgBuffer, (err,files) => {
            console.log(err,files);
            this.setState({ imgIpfsHash: files[0].hash });
        })
        
        //create JSON obj
        const doc = JSON.stringify({
            descriptionOfTask: this.state.taskDesc,
            rewardYouEarn: this.state.reward + ' finneys',
            deadline: this.state.deadline,
            imgIpfsHash: this.state.imgIpfsHash
        });

		await console.log(doc);
		
		const buf = Buffer.from(doc)
        this.setState ({ bufferJSON : buf });
        
        const accounts = await web3.eth.getAccounts();
		
        await ipfs.add(this.state.bufferJSON,(err,files) => {
			console.log(err,files);
            this.setState({ ipfsHash: files[0].hash });
            
            const {addHash} = this.state.ContractInstance; //extract sendHash() from smart contract.

            sendHash(this.state.ipfsHash, {from: accounts[0]}, (err, transHash) => {
                console.log(transHash);
                this.setState({transactionHash: transHash});
            }); //sendHash() 
		});
    }


	render() {
        return <App 
            onSubmit = {this.handleSubmit}
            onDescribeChange = {this.handleDescribeChange}
            onRewardChange = {this.handleRewardChange}
            onDeadlineChnage = {this.handleDeadlineChnage}
            onImageChange = {this.captureFile}
        />
    }
}

export default AppContainer;
