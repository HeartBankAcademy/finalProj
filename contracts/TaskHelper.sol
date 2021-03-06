pragma solidity ^0.4.24;
import '../installed_contracts/zeppelin/contracts/math/SafeMath.sol';
import '../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol';

/**
 * @title TaskHelper
 * @dev This contract has all the state variables and view functions. Done to separate function and data logic.
 */
contract TaskHelper is Pausable {

	//state variables.
    uint public task_id;
	
    mapping(address => address[]) public parentToChildren;
    mapping(uint => Task) public idToTask;

    struct Task {
        string ipfsHash;
        address childDoing;
        address parent;
        bool completed;
		bool verified;
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
        address[] memory array = parentToChildren[parent];
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
        address parent = idToTask[id].parent;
        return doesChildBelongsToParent(parent, child);
    }
    
	/**
	  * @notice Gets the latest task id.
	  */
    function getLatestTaskId() public view returns (uint) {
        return task_id;
    }

	/** @notice Gets the relevant details of a particular task.
	  * @dev Returns individual values of each item of the Task struct
	  * @param id the task id
	  */
    function getCorrespondingTask(uint id) public view 
        returns (string, address, address, bool, bool) 
        {
        Task memory task = idToTask[id];
        return (task.ipfsHash, task.parent, task.childDoing, task.completed, task.verified);
    }
}