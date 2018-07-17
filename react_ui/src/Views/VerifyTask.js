import React, { Component } from 'react';

class VerifyTask extends Component{
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
        const {verifyTask} = this.props.contractInstance;
        const {getCorrespondingTask} = this.props.contractInstance;
        let _id = document.querySelector('input[name=task_id]').value;
        await getCorrespondingTask(_id, (err,result) => {
            console.log(result);
            let amount = result[3].toNumber();
            console.log(amount);
            verifyTask(_id, {value: amount}, (err,txHash) => {
                if (err) {
                    alert("Either the task of this task id hasn't been logged as completed in the system OR you aren't the right person/address to close the task OR You aren't sending enough finney(ether) as written while creating the task!");
                } else {
                    this.setState({
                        successful: true,
                        transactionHash: txHash
                    });
                }
            }); 
        });               
    }
	
	render() {

        let msg;
        if (this.state.successful){
            msg = <p>Success! The payment has been made. This task has been verified too! Transaction hash: {this.state.transactionHash}.</p>
        }

		return (        
          <div id="verifyCompleted" className="VerifyTask">            
            <hr />
            <h2>Verify a Completed Task</h2>
            <p>If some of the tasks that you assigned have been done, and you have verified it, then please put that here too, to process the payment/mark the task as verified! </p>
            <p><strong>NOTE</strong>-Check the metamask transaction - the "amount" field will be same as the reward set for the task!</p>
            
            <form  onSubmit = { this.handleSubmit }>
              <input type="text" placeholder="enter task id" name="task_id"/>
              <input type="submit" />
            </form>

            {msg}
          </div>
        );
    }
}

export default VerifyTask;