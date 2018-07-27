import React, { Component } from 'react';
import web3 from '../utils/web3';
//import ipfs from '../utils/ipfs';

class ShowTasks extends Component{
    constructor(props) {
        super(props);

        this.state = {
			ids: []
        }
		
		this.handleSubmit = this.handleSubmit.bind(this);
    } 
	
	async handleSubmit(e) {
		e.preventDefault();
		let _addr = document.querySelector('input[name=addr]').value;
		let id;
		const {TaskCreated} = this.props.contractInstance;
		const {TaskDoing} = this.props.contractInstance;
		const {TaskCompleted} = this.props.contractInstance;
		
		if(!web3.utils.isAddress(_addr))
            alert("the address entered is invalid. Please try again!");
        else {
			TaskCreated({parent: _addr}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
				if (!error) {
			  		console.log(JSON.stringify(eventResult));
				  	
			  	}
			});
		}
	}
	
	render() {
		return (        
          <div id="showTasks" className="ShowTasks">            
            <hr />
            <h2>See your Tasks </h2>
			<form  onSubmit = { this.handleSubmit }>
			Enter your ethereum address (w-out single quotes): 
              <input type="text" placeholder="your ethereum address" name="addr"/>
              <input type="submit" />
            </form>
			 <h4> Tasks Delegated by you </h4>
			 <p><strong>NOTE: </strong> There are 3 sections here:</p>
			 <ul>
				<li>Tasks assigned, but not yet done</li>
				<li>Tasks assigned, done but not yet verified</li>
				<li>Tasks completed and verified </li>
			 </ul>
			
			 <h4> Tasks given to you </h4>
			 <p><strong>NOTE: </strong> There are 2 sections here:</p>
			 <ul>
				<li>Tasks you are currently doing</li>
				<li>Tasks you have completed, but not yet verified</li>
			 </ul>
            

          </div>
        );
    }
}

export default ShowTasks;