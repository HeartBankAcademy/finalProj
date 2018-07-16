import React, { Component } from 'react';
import web3 from './web3';

class AddChildren extends Component{
    constructor(props) {
        super(props);

        this.state = {
            showError: false,
            added: false,
            transactionHash: null
        }
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const { addChildren } = this.props.contractInstance;
        
        let _addr = document.querySelector('input[name=address]').value;
        if(!web3.utils.isAddress(_addr)) {
            console.log('fasle');
            this.setState({ showError: true, 
                            added: false });
        } else {
            console.log('h1');
            await addChildren(_addr, (err,txhash)=> {
                if(err){
                    console.log('false');
                    this.setState({ showError: true, 
                        added: false });
                } else {
                    console.log('true?');
                    this.setState({
                        transactionHash: txhash,
                        showError: false,
                        added: true
                    });
                }
                     //DONT ALLOW PEOPLE TO ADD MULTIPLE SAME ACCOUNTS?????        
                   /* if (this.state.addedgs.result) {
                        this.setState({ 
                            showError: false,
                            added: true });
                    } else {
                        this.setState({ showError: true, 
                                        added: false });
                    }
                });*/
                
            });
        }
    }
	
	render() {

        let msg;
        let error;
        if(this.state.added) {
            msg = <p> added a child address! Trasaction hash: {this.state.transactionHash}. You can also add other children!</p>;
        } 
        if(this.state.showError) {
            error = <p> you seem to have entered an invalid account address, or you have added an already addded address. Try Again. </p>;
        }
		return (
          <div id="addChildren" className="AddChildren">
            <hr />
            <h1> Add your children, who may do tasks for you!</h1>
            <form  onSubmit = { this.handleSubmit }>
              Enter your child's ethereum wallet address (without any single quotes) : 
              <input type="text" placeholder="child's ethereum wallet address" name="address"/>
              <input type="submit" />
            </form>
            <br />
            {msg}
            {error}
          </div>
        );
    }
}

export default AddChildren;