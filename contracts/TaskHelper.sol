pragma solidity ^0.4.15;

/**@title TaskHelper methods, getters to support TaskManager.sol*/
contract TaskHelper {
	//state variables.
    uint public task_id;
    mapping(address => address[]) public parent_to_children;
    mapping(uint => Task) public id_to_task;

    struct Task {
        string ipfsHash;
        address childDoing;
        address parent;
        uint payment;
        bool completed;
    }
    
	/** @notice Checks if a child (address) is associated to a particular parent (address).
      * @param parent address of the parent.
      * @param child address of the child
	  * @return bool if the child is associated to the parent or no.
	  */
    function doesChildBelongsToParent(address parent, address child) 
        internal 
        view 
        returns (bool) 
        {
        address[] memory array = parent_to_children[parent];
        for (uint i = 0; i < array.length; i++) {
            if (child == array[i]) 
                return true;
        }
        return false;
    }
    
	/** @notice Checks if a child (address) is associated to a particular task.
      * @param id the task id.
      * @param child address of the child
	  * @return bool if the child is associated to the task or no.
	  */
    function doesChildBelongsToTask(uint id, address child) internal view returns(bool) {
        address parent = id_to_task[id].parent;
        return doesChildBelongsToParent(parent, child);
    }
    
	//@notice Gets the latest task id.
    function getLatestTaskId() public view returns (uint) {
        return task_id;
    }

	/** @notice Gets the relevant details of a particular task.
	  * @dev Returns individual values of each item of the Task struct
	  * @param id the task id
	  */
    function getCorrespondingTask(uint id) public view 
        returns (string, address, address, uint, bool) 
        {
        Task memory task = id_to_task[id];
        return (task.ipfsHash, task.parent, task.childDoing, task.payment, task.completed);
    }
}