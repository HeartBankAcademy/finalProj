pragma solidity ^0.4.13;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TaskManager.sol";

contract TestTaskManager {

    TaskManager taskManager = TaskManager(DeployedAddresses.TaskManager());
	
	//Testing on modifiers and require statements.	
	
	//doingATask TEST
	function testDoingTask() public {
		taskManager.addTask("Qm3xrP");
		//create a new addr and call doingATask from there!
		TaskManager taskM = new TaskManager(); 
		bool res = helperDoingATask(address(taskM),1);
		Assert.isFalse(res, "Only someone belonging to the task (i.e. assigned by the parent) can do it");
	}
	
	//completedATask TEST
	
	function testCompletedATask() public {
		//create a new addr and call completedATask from there!
		TaskManager taskM = new TaskManager(); 
		bool res = helperCompletedATask(address(taskM),1);
		Assert.isFalse(res, "Only can complete task, if someone is doing it!");
	}
	
	//verifyTask TEST
	
	function testVerifyTask() public {
		bool res = taskManager.call(bytes4(keccak256("verifyTask(uint)", uint(1))));
		Assert.isFalse(res, "Can't verify an uncompleted task!");
	}
	
	//helper function to call doingATask.
	function helperDoingATask(address taskManAddr, uint id) public returns (bool r) {
		r = address(taskManAddr).call(bytes4(keccak256("doingATask(uint)", uint(id))));
		//this is how solidity identifies functions under the hood.
	}
	
	//helper function to call completedATask.
	function helperCompletedATask(address taskManAddr, uint id) public returns (bool r) {
		r = address(taskManAddr).call(bytes4(keccak256("completedATask(uint)", uint(id))));
		//this is how solidity identifies functions under the hood.
	}
	
	
}