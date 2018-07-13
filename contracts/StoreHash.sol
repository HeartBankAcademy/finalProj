pragma solidity ^0.4.15;

contract StoreHash {

    uint task_id;  //person_id????????///???/////////?????//////??????
    mapping (uint => string) id_to_hashes;  
    mapping(uint => addres) task_to_parent;
    mapping(address => address[]) parent_to_children;

    //MODIFIERs=
    //onlyParent
    //onlyChildren can see the specific id modifier
    
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