pragma solidity ^0.4.15;

contract StoreHash {

    uint task_id;  //person_id????????///???/////////?????//////??????
    mapping (uint => string) id_to_hashes;  
    mapping(address => uint[]) parent_to_tasks;
    mapping(address => address[]) parent_to_children;

    event HashAdded(uint id, address parent); //to store msg.sender and use it in front end!

    //MODIFIER
    //onlyParent
    //onlyChildren can see the specific id modifier
    
    function addHash(string _ipfsHash) public {
        task_id++;  //use safemath.        
        id_to_hashes[task_id] = _ipfsHash;
        emit HashAdded(task_id, msg.sender);
    }

    function getLatestTaskId() public view returns (uint) {
        return task_id;
    }

    function getCorrespondingHash(uint id) public view returns (string) {
        return id_to_hashes[id];
    }
}