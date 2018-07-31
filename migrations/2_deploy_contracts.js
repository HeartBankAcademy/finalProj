//var Ownable = artifacts.require("../installed_contracts/zeppelin/contracts/ownership/Ownable.sol");
var SafeMath = artifacts.require("../installed_contracts/zeppelin/contracts/math/SafeMath.sol");
var Pausable = artifacts.require("./../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol");
var TaskHelper = artifacts.require("./TaskHelper.sol");
var TaskManager = artifacts.require("./TaskManager.sol");

module.exports = function(deployer) {

	//only deploy Pausable, SafeMath if not already deployed on the test net.	
	
	deployer.then(async () => {
		await deployer.deploy(SafeMath, {overwrite: false})
		//await deployer.deploy(Ownable, {overwrite: false})
		await deployer.deploy(Pausable, {overwrite: false})
	});
			
	deployer.deploy(TaskHelper);
	deployer.deploy(TaskManager);
	//deployer.link(Ownable, TaskHelper);
	deployer.link(Pausable, TaskHelper);
	deployer.link(Pausable, TaskManager);
	deployer.link(SafeMath, TaskManager);
};