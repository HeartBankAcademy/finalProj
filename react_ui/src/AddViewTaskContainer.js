import React, { Component } from 'react';
import AddViewTask from './AddViewTask';
import web3 from './web3';
import ipfs from './ipfs';

class AddViewTaskContainer extends Component{
    constructor(props) {
        super(props);

        const contractABI = window.web3.eth.contract(
            [{"constant":false,"inputs":[{"name":"child","type":"address"}],"name":"addChildren","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_ipfsHash","type":"string"}],"name":"addHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLatestTaskId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getCorrespondingHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]
        ); //abi

        this.state = {
            contractInstance: contractABI.at('0x82f2e8ba5189e6715ceeb8459d4edceacd71d519'), //addr
            taskDesc: '',
            reward: '',
            deadline: '',
            imgIpfsHash: null,
            imgBuffer: '',
            ipfsHash: null,
            transactionHash: '',
            showTaskId: false,
            showError: false
        }

        this.captureFile = this.captureFile.bind(this);
        this.convertToBuffer = this.convertToBuffer.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addJSONToIpfs = this.addJSONToIpfs.bind(this);
        this.handleSubmitTaskId = this.handleSubmitTaskId.bind(this);
        this.getTaskDetails = this.getTaskDetails.bind(this);
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
                id = id.toNumber()+1;
                this.setState({taskId: id});  //+1 wala problem
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

    async handleSubmitTaskId(e) {
        e.preventDefault(); 
        const {getLatestTaskId} = this.state.contractInstance;
        getLatestTaskId((err, id) => {
            id = id.toNumber();
            let _id = document.querySelector('input[name=task_id]').value;
//don't allow checking for invalid task ids!
            if (_id<0 || _id>id){
                this.setState({
                    showError: true,
                    showTaskId: false
                });
            } else {
                this.setState({
                    showError: false,
                    showTaskId: true
                });
                this.getTaskDetails(_id);
            } //else
        });
    }

    async getTaskDetails(_id) {
        const {getCorrespondingHash} = this.state.contractInstance;        
        await getCorrespondingHash(_id, (err, hash) => {
        //save result in hash var.
            console.log(err,hash);

            ipfs.cat(hash, (err,buffer) => {
                let temp = JSON.parse(buffer.toString()); 
                console.log(temp);
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
        return <AddViewTask 
            onSubmit = {this.handleSubmit} onImageChange = {this.captureFile}
            onSubmitTaskId = {this.handleSubmitTaskId}
            taskId = {this.state.taskId} taskDesc = {this.state.taskDesc}
            reward = {this.state.reward} deadline = {this.state.deadline}
            ipfsHash = {this.state.ipfsHash} showError = {this.state.showError}
            showTaskId = {this.state.showTaskId}
            imgIpfsHash = {this.state.imgIpfsHash} 
            transactionHash = {this.state.transactionHash} 
        />
    }
}

export default AddViewTaskContainer;