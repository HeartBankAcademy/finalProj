pragma solidity ^0.4.15;

contract StoreHash {

    uint private task_id;  
    mapping (uint => string) private id_to_hashes;  
    mapping(uint => address) task_to_parent;
    mapping(address => address[]) parent_to_children;

    function addChildren(address child) {
       parent_to_children[msg.sender].push(child);
    }
    
   //onlyParent verifies a completed task_id
    modifier onlyParent(uint id) {
        require(msg.sender == task_to_parent[id]);
        _;
    }
    
   //onlyChild logs that he completed a task
    function childBelongsToTask(uint id) internal view returns(bool) {
        address parent = task_to_parent[id];
        address[] memory array = parent_to_children[parent];
        for (uint i = 0; i < array.length; i++) {
            if (msg.sender == array[i]) 
                return true;
        }
        return false;
    }
    
    function addHash(string _ipfsHash) public {
        task_id++;  //use safemath.        
        id_to_hashes[task_id] = _ipfsHash;
        task_to_parent[task_id] = msg.sender;
    }

    function getLatestTaskId() public view returns (uint) {
        return task_id;
    }

    function getCorrespondingHash(uint id) public view returns (string) {
        return id_to_hashes[id];
    }
}