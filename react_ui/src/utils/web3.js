import Web3 from 'web3'

var web3 = window.web3

if (typeof web3 !== 'undefined') {
    //use Metamask/mist's provider
    web3 = new Web3(web3.currentProvider)

} else {
    //// If no injected web3 instance is detected, fallback to Ganache CLI.
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
    web3 = new Web3(provider)
}

export default web3;