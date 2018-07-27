import React, { Component } from 'react';
import ShowTasks from './ShowTasks';
import web3 from '../utils/web3';

class GetTasks extends Component{
    constructor(props) {
        super(props);

        this.state = {
			address: null,
			tasksDelegated_uncompleted: [],
			tasksDelegated_unverified: [],
			tasksDelegated_verified: [],
			tasksDoing: [],
			tasksCompleted: []
        }
		this.initialState = this.state; //DEEP CLONE IF THIS DOESNT WORK.
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.resetState = this.resetState.bind(this);
    } 
	
	addTaskToArray(arr, taskId) {
		this.setState({ arr: [...this.state.arr, taskId] });
	}
	
	async handleSubmit(e) {
		e.preventDefault();
		let _addr = document.querySelector('input[name=addr]').value;
		let i;
		let id;
		let taskDetails = [];
		
		const {getCorrespondingTask} = this.props.contractInstance;
		const {TaskCreated} = this.props.contractInstance;
		const {TaskDoing} = this.props.contractInstance;
		const {TaskCompleted} = this.props.contractInstance;
		
		if(!web3.utils.isAddress(_addr))
            alert("the address entered is invalid. Please try again!");
        else {
			this.setState({address: _addr});
			await TaskCreated({parent: _addr}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
				if (!error) {
			  		console.log(JSON.stringify(eventResult));
					for(i=0; i<eventResult.length; i++) {
						id = eventResult[i].args.id.toNumber();
						getCorrespondingTask(id, (err,res) => {
							console.log(err,res);
							taskDetails = [id, res[0], res[2], res[3], res[4]];
							if(!taskDetails[3]) //if not completed -> add to tasksDelegated_uncompleted
								this.setState({ tasksDelegated_uncompleted: [...this.state.tasksDelegated_uncompleted, taskDetails.splice(-2)] });
							else if(!taskDetails[4]) //if not verified -> add to tasksDelegated_unverified
								this.setState({ tasksDelegated_unverified: [...this.state.tasksDelegated_unverified, taskDetails.splice(-2)] });
							else if (taskDetails[4])//verfied -> add to tasksDelegated_verified	
								this.setState({ tasksDelegated_verified: [...this.state.tasksDelegated_verified, taskDetails.splice(-2)] });
						}) //getCorrespondingTask()
					} //for loop.
			  	} 
			}); //TaskCreated()
			
			await TaskDoing({childDoing: _addr}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
				if (!error) {
			  		console.log(JSON.stringify(eventResult));
					for(i=0; i<eventResult.length; i++) {
						id = eventResult[i].args.id.toNumber();
						getCorrespondingTask(id, (err,res) => {
							console.log(err,res);
							taskDetails = [id, res[0], res[1], res[3]];
							if(!taskDetails[3]) //if not completed -> add to tasksDoing
								this.setState({ tasksDoing: [...this.state.tasksDoing, taskDetails.splice(-1)] });
						}) //getCorrespondingTask()
					} //for loop.
			  	} 
			}); //TaskDoing()
			
			await TaskCompleted({childDoing: _addr}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
				if (!error) {
			  		console.log(JSON.stringify(eventResult));
					for(i=0; i<eventResult.length; i++) {
						id = eventResult[i].args.id.toNumber();
						getCorrespondingTask(id, (err,res) => {
							console.log(err,res);
							taskDetails = [id, res[0], res[1], res[4]];
							if(!taskDetails[3]) //if not verfified -> add to tasksCompleted
								this.setState({ tasksCompleted: [...this.state.tasksCompleted, taskDetails.splice(-1)] });
						}) //getCorrespondingTask()
					} //for loop.
			  	} 
			}); //TaskCompleted()
		} //else
	}
	
	resetState() {
		this.setState(this.initialState);
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
			
			 <ShowTasks tasks={this.state.tasksDelegated_uncompleted} type={1}/>
			 <ShowTasks tasks={this.state.tasksDelegated_unverified} type={1}/>
			 <ShowTasks tasks={this.state.tasksDelegated_verified} type={1}/>
			 <ShowTasks tasks={this.state.tasksDoing} type={2}/>
			 <ShowTasks tasks={this.state.tasksCompleted} type={2}/>
          </div>
        );
    }
}

export default GetTasks;