import React, { Component } from 'react';
import ShowTasks from './ShowTasks';
import web3 from '../utils/web3';

class GetTasks extends Component{
    constructor(props) {
        super(props);

        this.state = {
			tasksDelegated_uncompleted: [],
			tasksDelegated_unverified: [],
			tasksDelegated_verified: [],
			tasksDoing: [],
			tasksCompleted: [],
			show: [false,false,false,false,false]
        }
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.resetState = this.resetState.bind(this);
    } 
	
	async handleSubmit(e) {
		e.preventDefault();
		this.resetState();
		let _addr = document.querySelector('input[name=addr]').value;
		let taskDetails = [];
		//to avoid async behavior: create 5 temp arrays (one for each array of this.state).
		let temp1 = [];
		let temp2 = [];
		let temp3 = [];
		let temp4 = [];
		let temp5 = [];
		let tempShow = this.state.show;
		const {getCorrespondingTask} = this.props.contractInstance;
		const {TaskCreated} = this.props.contractInstance;
		const {TaskDoing} = this.props.contractInstance;
		const {TaskCompleted} = this.props.contractInstance;
		
		if(!web3.utils.isAddress(_addr))
            alert("the address entered is invalid. Please try again!");
        else {	
			await TaskCreated({parent: _addr}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
				if (!error) {
			  		console.log(JSON.stringify(eventResult));
					for(let i=0; i<eventResult.length; i++) {
						let _id = eventResult[i].args.id.toNumber();						
						getCorrespondingTask(_id, (err,res) => {
							taskDetails = [_id, res[0], res[2], res[3], res[4]];
							if(!taskDetails[3]) { //if not completed -> add to tasksDelegated_uncompleted
								temp1.push(taskDetails.slice(0,3));
								this.setState({ tasksDelegated_uncompleted: temp1 });
								tempShow[0] = true;
								console.log("length now is: " + this.state.tasksDelegated_uncompleted.length);
							} else if(!taskDetails[4]) {//if not verified -> add to tasksDelegated_unverified
								temp2.push(taskDetails.slice(0,3));
								this.setState({ tasksDelegated_unverified: temp2 });
								tempShow[1] = true;
							} else if (taskDetails[4]) {//verfied -> add to tasksDelegated_verified	
								temp3.push(taskDetails.slice(0,3));
								this.setState({ tasksDelegated_verified: temp3 });
								tempShow[2] = true;								
							}							
						}) //getCorrespondingTask()
					} //for loop.
					this.setState({ show: tempShow });
			  	} 				
			}); //TaskCreated()
						
			await TaskDoing({childDoing: _addr}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
				if (!error) {
			  		console.log(JSON.stringify(eventResult));
					for(let i=0; i<eventResult.length; i++) {
						let id = eventResult[i].args.id.toNumber();
						getCorrespondingTask(id, (err,res) => {
							console.log(err,res);
							taskDetails = [id, res[0], res[1], res[3]];							
							if(!taskDetails[3]) {//if not completed -> add to tasksDoing
								temp4.push(taskDetails.slice(0,3));
								this.setState({ tasksDoing: temp4 });	
								tempShow[3] = true;								
							}
						}) //getCorrespondingTask()
					} //for loop.
					this.setState({ show: tempShow });
			  	} 
			}); //TaskDoing()
			
			await TaskCompleted({childDoing: _addr}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
				if (!error) {
			  		console.log(JSON.stringify(eventResult));
					for(let i=0; i<eventResult.length; i++) {
						let id = eventResult[i].args.id.toNumber();
						getCorrespondingTask(id, (err,res) => {
							//console.log(err,res);
							taskDetails = [id, res[0], res[1], res[4]];
							
							if(!taskDetails[3]) {//if not verfified -> add to tasksCompleted
								temp5.push(taskDetails.slice(0,3));
								this.setState({ tasksCompleted: temp5 });
								tempShow[4] = true;								
							}
						}) //getCorrespondingTask()
					} //for loop.
					this.setState({ show: tempShow });
			  	} 
			}); //TaskCompleted()
		} //else		
	}
	
	resetState() {
		this.setState({
			tasksDelegated_uncompleted: [],
			tasksDelegated_unverified: [],
			tasksDelegated_verified: [],
			tasksDoing: [],
			tasksCompleted: [],
			show: [false,false,false,false,false]
        })
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
		
			Tasks assigned, but not yet done	
			{this.state.show[0] ? <ShowTasks tasks={this.state.tasksDelegated_uncompleted} type={1}/> : <p></p>}
			Tasks assigned, done but not yet verified
			{this.state.show[1] ? <ShowTasks tasks={this.state.tasksDelegated_unverified} type={1}/> : <p></p>}
			Tasks completed and verified 
			{this.state.show[2] ? <ShowTasks tasks={this.state.tasksDelegated_verified} type={1}/> : <p></p>}
			<h4> Tasks given to you </h4>
			Tasks you are currently doing
			{this.state.show[3] ? <ShowTasks tasks={this.state.tasksDoing} type={2}/> : <p></p>}
			Tasks you have completed, but not yet verified
			{this.state.show[4] ? <ShowTasks tasks={this.state.tasksCompleted} type={2}/> : <p></p>}

          </div>
        );
    }
}

export default GetTasks;