var TaskManager = artifacts.require('TaskManager')

contract('TaskManager', function(accounts) {

    const parent = accounts[0]
    const child1 = accounts[1]
    const child2 = accounts[2]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    var price = web3.toWei(1, "ether")   //in string.
    price = parseInt(price, 10)

	//Testing only for passing conditions here:
	//that everything works if all details are correct
	it("should be able to add children previously not added", async() => {
		const taskManager = await TaskManager.deployed()
		
		taskManager.addChildren(child, {from: parent});
		let addr = taskManager.parentToChildren(parent,0)
    })
	
	it("should not add already added children", async() => {

    })
	
	
	
	
	
	
	
    it("should add a task when provided with a hash", async() => {
        const taskManager = await TaskManager.deployed()

        const _hash = "Qm..."

        let tx = await taskManager.addTask(_hash, {from: parent})
        let _id = await taskManager.getLatestTaskId();
        assert.equal(_id,1,'it doesn\'t create the right task id')
        let result = await taskManager.getCorrespondingTask(1)

        assert.equal(result[0], _hash, 'the hash of the last added item does not match the expected value')
       assert.equal(result[1], parent, 'the person who added task and parent address don\'t match')
        assert.equal(result[2], emptyAddress, 'no one should be the doing the task')
        assert.equal(result[3], false, 'task is not completed and yet it shows otherwise.')
    })

    

    

    it("should allow the right child to do a task", async() => {

    })

    //shouldnt allow wrong one to do task
    //shouldnt allow other child to do a task already done by someone else
    //allow same person to complete rask
    //not allow someone els eto complete task

    //alow only parent to do task
    //task must be completed to verify
    //another parent can't do the task!
})

/*pragma solidity ^0.4.13;
/*
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TaskManager.sol";

contract TestTaskManager {

    TaskManager taskManager = TaskManager(DeployedAddresses.TaskManager());
    
    //AddTask - check right task id is created!
    function testTaskId() public {
        taskManager.addTask("Qm3xrP");
        uint  id = taskManager.getLatestTaskId();
        uint _id = 1;
        Assert.isTrue(id==_id,"addTask creates the right task ids.");        
    }
}*/