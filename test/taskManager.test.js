var TaskManager = artifacts.require('TaskManager')

contract('TaskManager', function(accounts) {

    const parent = accounts[0]
    const child1 = accounts[1]
    const child2 = accounts[2]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    var price = web3.toWei(1, "ether")   //in string.
    price = parseInt(price, 10)

	//Testing for passing conditions when everything is correct 
	//AND also checking some require statements.
	
	//helper method to check for solidity throws!
	function assertJump(error) {
  		if(error.toString().indexOf("invalid JUMP") == -1) {
			console.log("We were expecting a Solidity throw (aka an invalid JUMP)," + 
						"we got one. Test succeeded.");
		} else {
			assert(false, error.toString());
		}
	}
	//AddChildren TESTS
	
	it("should be able to add children previously not added", async() => {
		const taskManager = await TaskManager.deployed()
		await taskManager.addChildren(child1, {from: parent});
		let addr = await taskManager.parentToChildren.call(parent,0);
		assert.equal(addr, child1, 'the child added and the child recorded don\'t ' + 
					 'match.');		
    })
	
	it("should not add already added children", async() => {
		const taskManager = await TaskManager.deployed()
		
		try {
		  await taskManager.addChildren(child1, {from: parent});
		  assert.fail('should have thrown before');
		} catch(error) {			  
		  assertJump(error);
		}

    })
	
	//AddTask TEST
	
	it("should add a task when provided with a hash", async() => {
        const taskManager = await TaskManager.deployed()

        const _hash = "Qm..."

        let tx = await taskManager.addTask(_hash, {from: parent})
        let _id = await taskManager.getLatestTaskId();
        assert.equal(_id,1,'it doesn\'t create the right task id')
        let result = await taskManager.getCorrespondingTask(1)

        assert.equal(result[0], _hash, 'the hash of the last added item does not'+
					 ' match the expected value')
        assert.equal(result[1], parent, 'the person who added task and parent '+
					 'address don\'t match')
        assert.equal(result[2], emptyAddress, 'no one should be the doing the task')
        assert.equal(result[3], false, 'task is not completed and yet it shows '+
					 'otherwise.')
    })
	
	//DoingTask TESTS
	
	it("should allow the right child to do a task", async() => {
		const taskManager = await TaskManager.deployed();
		
		let tx = await taskManager.doingATask(1, {from: child1});
		//watch for event
		let eventName = tx.logs[0].event;
		let childDOing = tx.logs[0].args.childDoing;
		let id = tx.logs[0].args.id;
		let result = await taskManager.getCorrespondingTask(1)
		
		assert.equal('TaskDoing', eventName, 'Event name dont match');
		assert.equal(result[2],child1, 'Didnt log the child as doing the event correctly!');
		assert.equal(id, 1, 'Event params don\'t match');
		assert.equal(childDOing,child1, 'Event params don\'t match');		
    })
	
	it("should not allow someone to do the task, if it is being done by someone else", 
	   async() => {
		const taskManager = await TaskManager.deployed();
		
		try {
		  await taskManager.doingATask(1, {from: child2});
		  assert.fail('should have thrown before');
		} catch(error) {			  
		  assertJump(error);
		}		
    })
	
	//completedATask TESTS
	
	it("should allow the right child to log the task as completed", async() => {
		const taskManager = await TaskManager.deployed();
		
		let tx = await taskManager.completedATask(1, {from: child1});
		//watch for event
		let eventName = tx.logs[0].event;
		let childDOing = tx.logs[0].args.childDoing;
		let id = tx.logs[0].args.id;
		let result = await taskManager.getCorrespondingTask(1);
		
		assert.equal('TaskCompleted', eventName, 'Event name dont match');
		assert.equal(result[3],true, 'Didnt log the task as completed');
		assert.equal(id, 1, 'Event params don\'t match');
		assert.equal(childDOing,child1, 'Event params don\'t match');		
    })
	
	it("should not allow anyone else but the task doer to complete the task", async() => {
		const taskManager = await TaskManager.deployed();
		
		try {
			//child1 is doing the task. Calling completedATask from child2.
		  await taskManager.completedATask(1, {from: child2});
		  assert.fail('should have thrown before');
		} catch(error) {			  
		  assertJump(error);
		}		
    })
	
	
	//verifyTask TESTS
	
	it("should allow the right parent to verify the task and send payment", async() => {
		const taskManager = await TaskManager.deployed();
		
		await taskManager.verifyTask(1, {from: parent, value: price});
		let result = await taskManager.getCorrespondingTask(1);
		
		assert.equal(result[4],true, 'Didnt log the task as verified');	
    })
	
	it("should not allow someone else to verify the task", async() => {
		const taskManager = await TaskManager.deployed();
		
		try {
		  await taskManager.verifyTask(1, {from: child2, value: price});
		  assert.fail('should have thrown before');
		} catch(error) {			  
		  assertJump(error);
		}		
    })
	
	it("should not allow parent to verify a verified task", async() => {
		const taskManager = await TaskManager.deployed();
		
		try {
		  await taskManager.verifyTask(1, {from: parent, value: price});
		  assert.fail('should have thrown before');
		} catch(error) {			  
		  assertJump(error);
		}		
    })
})