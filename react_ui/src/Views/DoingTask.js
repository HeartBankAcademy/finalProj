import React, { Component } from 'react';

class DoingTask extends Component{
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
        const {doingATask} = this.props.contractInstance
        let _id = document.querySelector('input[name=task_id]').value;
        doingATask(_id, (err,txHash) => {
            if (err) {
                alert("Either someone else is doing the task you entered OR you aren't assigned to this task. Ensure that you have entered the right task id");
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
            msg = <p>Success! You have been logged as doing the task. Complete it now! Transaction hash: {this.state.transactionHash} </p>
        }

		return (        
          <div id="logDoing" className="DoingTask">            
            <hr />
            <h2>Confirm Doing a Task </h2>
            <p>If you choose to do one of the tasks assigned to you, please confirm that you are doing it. This is necessary for payment.</p>

            <form  onSubmit = { this.handleSubmit }>
              <input type="text" placeholder="enter task id" name="task_id"/>
              <input type="submit" />
            </form>

            {msg}
          </div>
        );
    }
}

export default DoingTask;