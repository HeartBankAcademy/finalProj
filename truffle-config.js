module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: "8545",
      network_id: "*"
    }    
  }
};

//DEPLOYMENT ON RINKEBY:
/*
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "repeat cargo weapon age wrestle chaos keep panic gallery wrestle alert elephant";

module.exports = {....
	rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/"+INFURA_API_KEY"),
      network_id: 4
    }
*/