var TaskHelper = artifacts.require("./TaskHelper.sol");
var TaskManager = artifacts.require("./TaskManager.sol");

module.exports = function(deployer) {

    deployer.deploy(TaskHelper).then( ()=> 
        deployer.deploy(TaskManager) );
};