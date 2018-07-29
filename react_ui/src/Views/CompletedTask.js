import React, { Component } from 'react';

class CompletedTask extends Component{
    constructor(props) {
        super(props);

        this.state = {
            successful: false,
            transactionHash: null
        }
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const {completedATask} = this.props.contractInstance
        let _id = document.querySelector('input[name=id]').value;
        await completedATask(_id, (err,txHash) => {
            if (err) {
                alert("Either you aren't the address that confirmed to do this task (i.e. someone someone else is doing this task) OR you aren't assigned to this task. Ensure that you have entered the right task id");
            } else {
                this.setState({
                    successful: true,
                    transactionHash: txHash
                });
            }
        });        
    }
	
	render() {

        let msg;
        if (this.state.successful){
            msg = <p>Success! You have been logged as completed to do the task. 
			Transaction hash: {this.state.transactionHash}. Kindly await for 
			the right person to verify it and get paid.</p>
        }

		return (        
          <div id="logCompleted" className="CompletedTask">            
            <hr />
            <h2>Confirm a Task as Done</h2>
            <p>If you have completed a task that you have confirmed as doing, 
			then please log the task as completed by entering its id, so that 
			the right person may verify it and process the payment.</p>

            <form  onSubmit = { this.handleSubmit }>
              <input type="text" placeholder="enter task id" name="id"/>
              <input type="submit" />
            </form>

            {msg}
          </div>
        );
    }
}

export default CompletedTask;