pragma solidity ^0.4.15;
import './TaskHelper.sol';

/**@title */
contract TaskManager is TaskHelper {
    
    modifier correctChild(uint id) {
        require(doesChildBelongsToTask(id,msg.sender));
        _;
    }
    modifier onlyParent(uint id) {
        address parent = id_to_task[id].parent;
        require(msg.sender==parent);
        _;
    }
    
    modifier checkEnough(uint _price) { 
        require(msg.value >= _price); 
        _;
    }

	/** @notice create a new task
	  * @dev initialize a struct Task and save it on a mapping with 
		corresponding id
      * @param _ipfsHash the ipfsHash where Task data is stored.
      * @param payment payment (in unit of wei).
	  */
    function addTask(string _ipfsHash, uint payment) public {
        task_id++;  //use safemath.     
        Task memory task = id_to_task[task_id];
        task.ipfsHash = _ipfsHash;
        task.parent = msg.sender;
        task.payment = payment;
        id_to_task[task_id] = task;
    } 
    
	/** @notice parent adds the children, who can do tasks for them.	
	  * @dev child address added to a mapping parent_to_children if 
		not already added.
      * @param child address of the child
	  */
    function addChildren(address child) {
        //don't allow to add same child again!
        require(!doesChildBelongsToParent(msg.sender, child)); 
        parent_to_children[msg.sender].push(child);
    }
    
	/** @notice a child confirms that he/she is doing the task	
	  * @dev in the task struct for the id, child's address is 
		stored if no other child is doing the task. 
      * @param _taskId the task id
	  */
    function doingATask(uint _taskId) correctChild(_taskId) {
        Task memory task = id_to_task[_taskId];
        require(task.childDoing==0x0000000000000000000000000000000000000000);
        task.childDoing = msg.sender;
        id_to_task[_taskId] = task;
    }
	
	/** @dev set task as completed, provided msg.sender was doing the task
      * @param id the task id
	  */    
    function completedATask(uint id) correctChild(id) {
        require(id_to_task[id].childDoing == msg.sender);
        id_to_task[id].completed = true;
    }
    
	/** @notice parent verifies the task and pays.
	  * @dev  must check that the right parent/address calls the method, 
		pays enough. Also refund amount if extra.
      * @param id the task id
	  */
    function verifyTask(uint id) payable
        onlyParent(id) 
        checkEnough(id_to_task[id].payment)
        {        
        Task memory task = id_to_task[id];    
        require(task.completed);        
        uint amountToRefund = msg.value - task.payment;
        task.childDoing.transfer(task.payment);
        //also transfer any extra funds back to sender (parent)
        task.parent.transfer(amountToRefund);
    }
}