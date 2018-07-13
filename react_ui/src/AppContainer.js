import React, { Component } from 'react';
import App from './App';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';


class AppContainer extends Component{
    constructor(props) {
        super(props);

        const contractABI = window.web3.eth.contract(
            [{"constant":false,"inputs":[{"name":"_ipfsHash","type":"string"}],"name":"addHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLatestTaskId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getCorrespondingHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]
        ); //abi

        this.state = {
            contractInstance: contractABI.at('0x5a498933391484f09e90d90c8c4cc2d8e6eb75b5'), //addr
            taskDesc: '',
            reward: '',
            deadline: '',
            imgIpfsHash: null,
            imgBuffer: '',
            ipfsHash: null,
            transactionHash: '',
            showTaskId: false
        }

        this.captureFile = this.captureFile.bind(this);
        this.convertToBuffer = this.convertToBuffer.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitTaskId = this.handleSubmitTaskId.bind(this);
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

        //get task description, deadline, reward
        let _taskDesc = document.querySelector('input[name=taskDesc]').value;
        let _deadline = document.querySelector('input[name=deadline]').value;
        let _reward = document.querySelector('input[name=reward]').value;
        let _imgIpfsHash = null;

        //create JSON obj
        const doc = {
            descriptionOfTask: _taskDesc, //this.state.taskDesc,
            rewardYouEarn: _reward /*this.state.reward*/ + ' finneys',
            deadline: _deadline, //this.state.deadline,
            IpfsHashOfImageUploaded: _imgIpfsHash
        };

        //add image to ipfs if imgBuffer is not an empty string:
        if (this.state.imgBuffer!='') {
            await ipfs.add(this.state.imgBuffer, (err,files) => {
                console.log('b4');
                console.log(err,files[0]);
                _imgIpfsHash = files[0].hash;
                doc.IpfsHashOfImageUploaded = _imgIpfsHash;
            });
            this.state.imgBuffer = ''; //set it back to null.
            await console.log('after1');
        }
        await console.log('after2');
        
        //create its buffer and add to ipfs.
        const buf = await Buffer.from(JSON.stringify(doc));
        
        this.setState({ 
            ipfsHash: 'awaiting',
            transactionHash: 'awaiting'
        });
        
        //add to ipfs
        await ipfs.add(buf, (err,files) => {            
            console.log(err,files);
            let _ipfsHash = files[0].hash;
            
            //add the ipfsHash to ethereum!
            const {addHash} = this.state.contractInstance;
            addHash(_ipfsHash, (err, transHash) => {
                this.setState({
                    transactionHash: transHash,
                    ipfsHash: _ipfsHash
                });
            });

            //get your task id
            const {getLatestTaskId} = this.state.contractInstance;
            getLatestTaskId((err, id) => {
                this.setState({taskId: id.toNumber()+1});  //+1 wala problem
            });
        })  
        
        
    }

    async handleSubmitTaskId(e) {
        e.preventDefault();
        this.setState({showTaskId: true});

        let id = document.querySelector('input[name=task_id]').value;
        console.log(id);
        const {getCorrespondingHash} = this.state.contractInstance;
        
        await getCorrespondingHash(id, (err, hash) => {
            //save result in hash var.
            if (err) console.error ('An error occured:::', err);
            console.log ("The hash is:", hash);

            ipfs.cat(hash, (err,buffer) => {
                let temp = JSON.parse(buffer.toString()); 
                this.setState({
                    taskDesc: temp.descriptionOfTask,
                    reward: temp.rewardYouEarn,
                    deadline: temp.deadline,
                    imgIpfsHash: temp.IpfsHashOfImageUploaded
                }); //setState
            })//ipfs.cat()
        })//getCorrespondingHash()
    }

	render() {
        return <App 
            onSubmit = {this.handleSubmit}
            /*onDescribeChange = {this.handleDescribeChange}
            onRewardChange = {this.handleRewardChange}
            onDeadlineChnage = {this.handleDeadlineChnage}
            */onImageChange = {this.captureFile}
            onSubmitTaskId = {this.handleSubmitTaskId}
            taskId = {this.state.taskId}
            taskDesc = {this.state.taskDesc}
            reward = {this.state.reward}
            deadline = {this.state.deadline}
            ipfsHash = {this.state.ipfsHash}
            imgIpfsHash = {this.state.imgIpfsHash}
            transactionHash = {this.state.transactionHash}
            showTaskId = {this.state.showTaskId}
        />
    }
}

export default AppContainer;

/*
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
    */
