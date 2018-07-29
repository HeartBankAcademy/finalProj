import React, { Component } from 'react';
import ShowTasks from './ShowTasks';
import web3 from '../utils/web3';

class GetTasks extends Component{
    constructor(props) {
        super(props);

        this.state = {
			//1 array - has taskDratils for each of the 5 tables.
			tasksDelegated_uncompleted: [],
			tasksDelegated_unverified: [],
			tasksDelegated_verified: [],
			tasksDoing: [],
			tasksCompleted: [],		
			//to only show the tables with some tasks in them
			show: [false,false,false,false,false],
			//flags - only can send details to ShowTask 
			//after all necessary task details have been fetched! 
			//Otherwise - competing threads
			okayToSetShow1: false,
			okayToSetShow2: false,
			okayToSetShow3: false	
			//only setState(show: tempShow) when all 3 flags allow 
			//(meaning when all 3 events have been fully read!
        }
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.resetState = this.resetState.bind(this);
    } 
	
	handleSubmit(e) {
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
		let tempShow = [false,false,false,false,false]; //deciding which OF THE 5 table to show	
		//^since state is basically immutable, using the best practise.
		
		const {getCorrespondingTask} = this.props.contractInstance;
		const {TaskCreated} = this.props.contractInstance;
		const {TaskDoing} = this.props.contractInstance;
		const {TaskCompleted} = this.props.contractInstance;
		try {
			if(!web3.utils.isAddress(_addr))
				alert("the address entered is invalid. Please try again!");
			else {	
				//event: TASKCREATED
				TaskCreated({parent: _addr}, { fromBlock: 0, toBlock: 'latest' })
				.get((error, eventResult) => {
					console.log(JSON.stringify(eventResult));
					//if no events,
					if(eventResult.length===0) { this.setState({ okayToSetShow1: true }); } 
					for(let i=0; i<eventResult.length; i++) {
						//for each event fetch details, and decide which table to show!
						let _id = eventResult[i].args.id.toNumber();						
						getCorrespondingTask(_id, (err,res) => {
							taskDetails = [_id, res[0], res[2], res[3], res[4]];
							if(!taskDetails[3]) { 
								//if not completed -> add to tasksDelegated_uncompleted
								temp1.push(taskDetails.slice(0,3));
								this.setState({ tasksDelegated_uncompleted: temp1 });
								tempShow[0] = true;
							} else if(!taskDetails[4]) {
								//if not verified -> add to tasksDelegated_unverified
								temp2.push(taskDetails.slice(0,3));
								this.setState({ tasksDelegated_unverified: temp2 });
								tempShow[1] = true;
							} else if (taskDetails[4]) {
								//verfied -> add to tasksDelegated_verified	
								temp3.push(taskDetails.slice(0,3));
								this.setState({ tasksDelegated_verified: temp3 });
								tempShow[2] = true;								
							}
							if(i===eventResult.length-1) { 
								//only after all events been read, allow for tables to be seen!
								this.setState({ okayToSetShow1: true }); 
								this.setState({ show: tempShow }); 
							}
						}) //getCorrespondingTask()
					} //for loop.				
				}); //TaskCreated()

				//event TaskDoing
				
				TaskDoing({childDoing: _addr}, { fromBlock: 0, toBlock: 'latest' })
				.get((error, eventResult) => {
					
					console.log(JSON.stringify(eventResult));
					if(eventResult.length===0) {this.setState({ okayToSetShow2: true }); }
					for(let i=0; i<eventResult.length; i++) {
						let id = eventResult[i].args.id.toNumber();
						getCorrespondingTask(id, (err,res) => {
							taskDetails = [id, res[0], res[1], res[3]];							
							if(!taskDetails[3]) {//if not completed -> add to tasksDoing
								temp4.push(taskDetails.slice(0,3));
								this.setState({ tasksDoing: temp4 });	
								tempShow[3] = true;	
							}
							if(i===eventResult.length-1) {
								this.setState({ okayToSetShow2: true }); 
								this.setState({ show: tempShow }); 
							}
						}) //getCorrespondingTask()
					} //for loop.
				}); //TaskDoing()

				//event TASKCOMPLETED
				
				TaskCompleted({childDoing: _addr}, { fromBlock: 0, toBlock: 'latest' })
				.get((error, eventResult) => {
					console.log(JSON.stringify(eventResult));
					if(eventResult.length===0) {this.setState({ okayToSetShow3: true }); }
					for(let i=0; i<eventResult.length; i++) {
						let id = eventResult[i].args.id.toNumber();
						getCorrespondingTask(id, (err,res) => {
							taskDetails = [id, res[0], res[1], res[4]];

							if(!taskDetails[3]) {//if not verfified -> add to tasksCompleted
								temp5.push(taskDetails.slice(0,3));
								this.setState({ tasksCompleted: temp5 });
								tempShow[4] = true;	
							}
							if(i===eventResult.length-1) {
								this.setState({ okayToSetShow3: true }); 
								this.setState({ show: tempShow }); 
							}
						}) //getCorrespondingTask()
					} //for loop.
				}); //TaskCompleted()
			} //else
		} //try
		catch(err) { console.log(err);}
	}
	
	resetState() {
		this.setState({
			tasksDelegated_uncompleted: [],
			tasksDelegated_unverified: [],
			tasksDelegated_verified: [],
			tasksDoing: [],
			tasksCompleted: [],
			show: [false,false,false,false,false],
			okayToSetShow1: false,
			okayToSetShow2: false,
			okayToSetShow3: false
        })
	}
	
	
	render() {
		let msg;
		if (this.state.okayToSetShow1 && this.state.okayToSetShow2 
				&& this.state.okayToSetShow3) {
			msg = 
			  <div>
				<h4> Tasks Delegated by you </h4>		
				Tasks assigned, but not yet done	
				{this.state.show[0] ? <ShowTasks tasks={this.state.tasksDelegated_uncompleted} 
					type={1}/> : <p>No such Tasks here.</p>}
				Tasks assigned, done but not yet verified
				{this.state.show[1] ? <ShowTasks tasks={this.state.tasksDelegated_unverified} 
					type={1}/> : <p>No such Tasks here.</p>}
				Tasks completed and verified 
				{this.state.show[2] ? <ShowTasks tasks={this.state.tasksDelegated_verified} 
					type={1}/> : <p>No such Tasks here.</p>}
				<h4> Tasks given to you </h4>
				Tasks you are currently doing
				{this.state.show[3] ? <ShowTasks tasks={this.state.tasksDoing} type={2}/> 
									: <p>No such Tasks here.</p>}
				Tasks you have completed, but not yet verified
				{this.state.show[4] ? <ShowTasks tasks={this.state.tasksCompleted} type={2}/> 
									: <p>No such Tasks here.</p>}
			  </div>
		} else msg = <div></div>;
		
		return (        
          <div id="showTasks" className="ShowTasks">            
            <hr />
            <h2>See your Tasks </h2>
			<form  onSubmit = { this.handleSubmit }>
			Enter your ethereum address (w-out single quotes): 
              <input type="text" placeholder="your ethereum address" name="addr"/>
              <input type="submit" />
            </form>			
			{msg}
          </div>
        );
    }
}

export default GetTasks;