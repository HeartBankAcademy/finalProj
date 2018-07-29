import React, { Component } from 'react';
import web3 from '../utils/web3';
import ipfs from '../utils/ipfs';

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
		this.finishVerification = this.finishVerification.bind(this);
    }

    handleAmtChange(e) {

        let _amt = e.target.value;
		//if amt a number, convert to Wei.
        if(/(^-?[0-9.]+)/.test(_amt)){
            _amt = web3.utils.toWei(_amt, "finney");
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
        const {getCorrespondingTask} = this.props.contractInstance;
		const {getLatestTaskId} = this.props.contractInstance;
		
		let _id = document.querySelector('input[name=taskId]').value;
		
        getLatestTaskId((err, id) => {
            id = id.toNumber(); 
			//don't allow checking for invalid task ids! - 
			//to only allow the right ipsHash in ipfs.cat!
            if (_id<1 || _id>id) 
				alert("Invalid task id!");	
			else {
				
				console.log(this.state.selectedOption);
        		if(this.state.selectedOption!=="yes") {	
					//get the ipfs hash of the id, and find the amount assigned.
					getCorrespondingTask(_id, (err,result) => {
						ipfs.cat(result[0], (err,buffer) => {					
							if (buffer != null) {
								let temp = JSON.parse(buffer.toString()); 
								console.log(temp);
								let _amt= temp.rewardYouEarn.split(" ")[0];
								console.log(_amt);
								_amt = web3.utils.toWei(_amt, "finney"); 
								console.log(_amt);
								this.setState({amount:_amt});
								//call finishVerification() - done to avoid await sync problem.
								this.finishVerification(_id);
							}
						})//ipfs.cat()                
					}); //getCorrespondingTask
					
				} else { //this.state.selectedOption!=="no"
					this.finishVerification(_id);
				}
			} //else
		})//getLatestTaskId()
	}

	async finishVerification(_id) {
		
		const {verifyTask} = this.props.contractInstance;
        await verifyTask(_id, {value: this.state.amount}, (err,txHash) => {
            if (err) {
				console.log(err);
                alert("Either the task of this task id hasn't been logged as completed in the system OR you aren't the right person/address to close the task OR you have set an illegal amount to pay");
            } else {
                this.setState({
                    successful: true,
                    transactionHash: txHash
                });
            }
        });   //verifyTask()          
    }
	
	render() {

        let newAmt;
        if(this.state.selectedOption === "no"){
            newAmt = 
            <div>
              Please enter the new reward (in Finney): 
              <input type="text" placeholder="enter new amount" name="new_amt" 
			    onChange = {this.handleAmtChange} />
            </div>;
        }
        
        let msg;
        if (this.state.successful){
            msg = <p>Success! The payment has been made. This task has been 
			verified too! Transaction hash: {this.state.transactionHash}.</p>
        }

		return (        
          <div id="verifyCompleted" className="VerifyTask">            
            <hr />
            <h2>Verify a Completed Task</h2>
            <p>If some of the tasks that you assigned have been done, and you have 
			verified it, then please put that here too, to process the payment/mark 
			the task as verified! </p>
            <p><strong>NOTE</strong>-Check the metamask transaction - the "amount" 
			field will be same as the reward set for the task!</p>
            
            <form  onSubmit = { this.handleSubmit }>
              <input type="text" placeholder="enter task id" name="taskId"/>
              <br />
              <br />
              Do you want to pay the full original reward amount?
              <label>
              <input type="radio" value="yes" 
              checked={this.state.selectedOption === "yes"}
			  onClick={this.handleOptionChange}
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