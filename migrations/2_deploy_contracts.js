var Ownable = artifacts.require("./Ownable.sol");
var Pausable = artifacts.require("./Pausable.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var TaskHelper = artifacts.require("./TaskHelper.sol");
var TaskManager = artifacts.require("./TaskManager.sol");

module.exports = function(deployer) {

	deployer.then(async () => {
		await deployer.deploy(SafeMath)
		await deployer.deploy(Ownable)
		await deployer.deploy(Pausable)
	});
	
	deployer.deploy(TaskHelper);
	deployer.deploy(TaskManager);
	deployer.link(Ownable, TaskHelper);
	deployer.link(Pausable, TaskHelper);
	deployer.link(Pausable, TaskManager);
	deployer.link(SafeMath, TaskManager);
};