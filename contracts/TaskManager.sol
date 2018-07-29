pragma solidity ^0.4.15;
import './TaskHelper.sol';


/**@title Handling theS tasks dashboard*/
contract TaskManager is TaskHelper {

	using SafeMath for uint;
	
	//events
	event TaskCreated(uint id, address indexed parent);
	event TaskDoing(uint id, address indexed childDoing);
	event TaskCompleted(uint id, address indexed childDoing);
    
    modifier correctChild(uint id) {
        require(doesChildBelongsToTask(id,msg.sender));
        _;
    }
    modifier onlyParent(uint id) {
        address parent = idToTask[id].parent;
        require(msg.sender==parent);
        _;
    }

	/** @notice create a new task
	  * @dev initialize a struct Task and save it on a mapping with 
		corresponding id
      * @param _ipfsHash the ipfsHash where Task data is stored.
	  */
    function addTask(string _ipfsHash) public {
        task_id = task_id.add(1); //use safemath.     
        Task memory task = idToTask[task_id];
        task.ipfsHash = _ipfsHash;
        task.parent = msg.sender;
        idToTask[task_id] = task;
		emit TaskCreated(task_id, msg.sender);
    } 
    
	/** @notice parent adds the children, who can do tasks for them.	
	  * @dev child address added to a mapping parentToChildren if 
		not already added.
      * @param child address of the child
	  */
    function addChildren(address child) {
        //don't allow to add same child again!
        require(!doesChildBelongsToParent(msg.sender, child)); 
        parentToChildren[msg.sender].push(child);
    }
    
	/** @notice a child confirms that he/she is doing the task	
	  * @dev in the task struct for the id, child's address is 
		stored if no other child is doing the task. 
      * @param _taskId the task id
	  */
    function doingATask(uint _taskId) correctChild(_taskId) {
        require(idToTask[_taskId].childDoing==0x0000000000000000000000000000000000000000);
        idToTask[_taskId].childDoing = msg.sender;
		emit TaskDoing(_taskId, msg.sender);
    }
	
	/** @dev set task as completed, provided msg.sender was doing the task
      * @param id the task id
	  */    
    function completedATask(uint id) correctChild(id) {
        require(idToTask[id].childDoing == msg.sender);
        idToTask[id].completed = true;
		emit TaskCompleted(id, msg.sender);
    }
    
	/** @notice parent verifies the task and pays.
	  * @dev  must check that the right parent/address calls the method, 
		and pays an amount.
      * @param id the task id
	  */
    function verifyTask(uint id) payable onlyParent(id) {        
        require(idToTask[id].completed);
		require(!idToTask[id].verified);
		idToTask[id].verified = true;
        idToTask[id].childDoing.transfer(msg.value);
    }
}