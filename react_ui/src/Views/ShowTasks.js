import React, { Component } from 'react';
import web3 from '../utils/web3';
import ipfs from '../utils/ipfs';

class ShowTasks extends Component{
    constructor(props) {
        super(props);
		
		this.state = {
			show: false,
			table: []
		}
		
		this.createTable = this.createTable.bind(this);
    } 
	
	async createTable() {
		let arr = this.props.tasks;
		console.log(arr.length); //ARR.LENGTH PROBLEM!!!!!!!!!
		let tempArr = []		
		//Outer loop - arr.length = no of tasks = no of rows!
		for (let i=0; i<arr.length; i++) {
			let details	= []
			details.push(<td key="{i+0.1}">{arr[i][0]}</td>); //id
			details.push(<td key="{i+0.2}">{arr[i][2]}</td>); //parent/childDoing
			let ipfsHash = arr[i][1];
			await ipfs.cat(ipfsHash, (err,buffer) => {				
				let temp = JSON.parse(buffer.toString()); 
				details.push(<td key="{i+0.3}">{temp.descriptionOfTask}</td>);
				details.push(<td key="{i+0.4}">{temp.rewardYouEarn}</td>);
				details.push(<td key="{i+0.5}">{temp.deadline}</td>);
				details.push(<td key="{i+0.6}">{temp.IpfsHashOfImageUploaded}</td>);
						
				tempArr.push(details)
				console.log(tempArr);
				this.setState({ table: tempArr});
				this.setState({ show: true});
            })//ipfs.cat()
		} //for loop
	}
	
	componentWillMount() {
		this.createTable();
	}
	
	render() {
		
		return (        
          <div>     
			<table border = "1">
			  <tbody>
				 <tr>
			       <th>Task ID</th>
					{this.props.type===1 ? <th>Task Do-er</th> : <th>Task Creator</th>}				   
				   <th>Task Description</th>
				   <th>Task Deadline</th>
				   <th>Task Reward</th>
				   <th>Image (if uploaded)</th>
				</tr>
				{this.state.show ? this.state.table.map((task,index) => {return <tr key={index}>{task}</tr> }) : <tr></tr> }
			  </tbody>
			</table>
          </div>
        );
    }
}

export default ShowTasks;