import React, { Component } from 'react';
import web3 from '../utils/web3';
import ipfs from '../utils/ipfs';

//ON CHANGE BAD FOR DELETING WEB3,UTILS

class VerifyTask extends Component{
    constructor(props) {
        super(props);

        this.state = {
            successful: false,
            transactionHash: null,
            selectedOption: "",
            amount: null
        }
        
        this.handleAmtChange = this.handleAmtChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleAmtChange(e) {

        let _amt = e.target.value;
        if(/(^-?[0-9.]+)/.test(_amt)){
            _amt = web3.utils.toWei(_amt, "finney");
            console.log(_amt);
            this.setState({amount: _amt});
        }
    }
    
    handleOptionChange(changeEvent) {
        this.setState({
          selectedOption: changeEvent.target.value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        const {verifyTask} = this.props.contractInstance;
        const {getCorrespondingTask} = this.props.contractInstance;
        let _id = document.querySelector('input[name=task_id]').value;
        if(this.state.selectedOption==="yes") {
            await getCorrespondingTask(_id, (err,result) => {
                ipfs.cat(result[0], (err,buffer) => {
                    if (buffer != null) {
                        let temp = JSON.parse(buffer.toString()); 
                        let _amt= temp.rewardYouEarn.split(" ")[0];
                        _amt = web3.utils.toWei(_amt, "finney"); 
                        this.setState({amount:_amt});
                    }
                })//ipfs.cat()                
            });
        }

        await verifyTask(_id, {value: this.state.amount}, (err,txHash) => {
            if (err) {
                alert("Either the task of this task id hasn't been logged as completed in the system OR you aren't the right person/address to close the task OR You aren't sending enough finney(ether) as written while creating the task!");
            } else {
                this.setState({
                    successful: true,
                    transactionHash: txHash
                });
            }
        });              
    }
	
	render() {

        let newAmt;
        if(this.state.selectedOption === "no"){
            newAmt = 
            <div>
              Please enter the new reward (in Finney): 
              <input type="text" placeholder="enter new amount" name="new_amt" onChange = {this.handleAmtChange} />
            </div>;
        }
        
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
              <br />
              <br />
              Do you want to pay the full original reward amount?
              <label>
              <input type="radio" value="yes" 
              checked={this.state.selectedOption === "yes"}
              onChange={this.handleOptionChange} />
              Yes!
              </label>
              <label>
              <input type="radio" value="no" 
              checked={this.state.selectedOption === "no"}
              onChange={this.handleOptionChange} />
              No, I will pay lesser than agreed.
              </label>
              {newAmt}
              <br />
              <input type="submit" />
            </form>
            {msg}
          </div>
        );
    }
}

export default VerifyTask;