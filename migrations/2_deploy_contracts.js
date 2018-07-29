var TaskHelper = artifacts.require("./TaskHelper.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var TaskManager = artifacts.require("./TaskManager.sol");

module.exports = function(deployer) {

	deployer.then(async () => {
		await deployer.deploy(SafeMath)
	});
	
	deployer.deploy(TaskHelper);
	//deployer.link(SafeMath, TaskHelper);
	deployer.deploy(TaskManager);
	deployer.link(SafeMath, TaskManager);
};