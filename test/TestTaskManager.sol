pragma solidity ^0.4.13;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TaskManager.sol";

contract TestTaskManager {

    TaskManager taskManager = TaskManager(DeployedAddresses.TaskManager());
	TaskManager taskM = new TaskManager(); //like another account
    
	//Testing only for passing conditions here:
	//that everything works if all details are correct
	
	//AddChildren
	
	function testAddChildren() public {
	
		taskManager.addChildren(rasjN);
	}
	
	
	
	
    //AddTask - check right task id is created!
    function testTaskId() public {
        taskManager.addTask("Qm3xrP");
        uint  id = taskManager.getLatestTaskId();
        uint _id = 1;
        Assert.isTrue(id==_id,"addTask creates the right task ids.");        
    }
}