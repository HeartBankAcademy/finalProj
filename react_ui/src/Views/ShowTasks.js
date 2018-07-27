import React, { Component } from 'react';
import web3 from '../utils/web3';
import ipfs from '../utils/ipfs';

class ShowTasks extends Component{
    constructor(props) {
        super(props);
		
		this.createTable = this.createTable.bind(this);
    } 
	
	async createTable() {
		let arr = this.props.tasks;
		let table = []		
		//Outer loop - arr.length = no of tasks = no of rows!
		for (let i=0; i<arr.length; i++) {
			let details	= []
			details.push(<td>arr[i][0]</td>); //id
			details.push(<td>arr[i][2]</td>); //parent/childDoing
			let ipfsHash = arr[i][1];
			console.log("yo before ipfs index:" + i);
			await ipfs.cat(ipfsHash, (err,buffer) => {
				console.log("yo2")
				let temp = JSON.parse(buffer.toString()); 
				details.push(<td>temp.descriptionOfTask</td>);
				details.push(<td>temp.rewardYouEarn</td>);
				details.push(<td>temp.deadline</td>);
				details.push(<td>temp.IpfsHashOfImageUploaded</td>);
            })//ipfs.cat()
			//create table
			table.push(<tr>{details}</tr>);
		} //for loop
		return table;
	}
					   
	render() {
		return (        
          <div>     
			<table border = "1">
			  <tbody>
				 <tr>
			       <th>Task ID</th>
				   <th>Parent/CHildDOing</th>
				   <th>Task Description</th>
				   <th>Task Deadline</th>
				   <th>Task Reward</th>
				   <th>Image (if uploaded)</th>
				</tr>
			{this.createTable}
			  </tbody>
			</table>
          </div>
        );
    }
}

export default ShowTasks;