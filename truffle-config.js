var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "repeat cargo weapon age wrestle chaos keep panic gallery wrestle alert elephant";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: "8545",
      network_id: "*"
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/7848e86fefda49de8a0dfc59bbea7e11"),
      network_id: 4
    }
  }
};
