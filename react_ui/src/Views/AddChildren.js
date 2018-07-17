import React, { Component } from 'react';
import web3 from '../utils/web3';

class AddChildren extends Component{
    constructor(props) {
        super(props);

        this.state = {
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
            alert("the address entered is invalid. Please try again!");
        } else {
            console.log('h1');
            await addChildren(_addr, (err,txhash)=> {
                if(err){
                    alert("It seems like you are trying to add an address that you have already added!");
                } else {
                    this.setState({
                        transactionHash: txhash,
                        added: true
                    });
                }
                
            });
        }
    }
	
	render() {

        let msg;
        if(this.state.added) {
            msg = <p> added a child address! Trasaction hash: {this.state.transactionHash}. You can also add other children!</p>;
        } 
		return (
          <div id="addChildren" className="AddChildren">
            <hr />
            <h2> Add your children, who may do tasks for you!</h2>
            <form  onSubmit = { this.handleSubmit }>
              Enter your child's ethereum wallet address (without any single quotes) : 
              <input type="text" placeholder="child's ethereum wallet address" name="address"/>
              <input type="submit" />
            </form>
            <br />
            {msg}
          </div>
        );
    }
}

export default AddChildren;