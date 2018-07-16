pragma solidity ^0.4.15;

contract StoreHash {

    uint private task_id;
    mapping(address => address[]) public parent_to_children;
    mapping(uint => Task) private id_to_task;

    struct Task {
        string ipfsHash;
        address childDoing;
        address parent;
        uint payment;
        bool completed;
    }
    
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
    modifier refundIfExtra(uint id) {
        //refund them after pay for item
        _;
        uint payment = id_to_task[id].payment;
        uint amountToRefund = msg.value - payment;
        id_to_task[id].parent.transfer(amountToRefund);
    }

    function addTask(string _ipfsHash, uint payment) public {
        task_id++;  //use safemath.     
        Task memory task = id_to_task[task_id];
        task.ipfsHash = _ipfsHash;
        task.parent = msg.sender;
        task.payment = payment;
        id_to_task[task_id] = task;
    } 
    
    function addChildren(address child) {
        //don't allow to add same child again!
        require(!doesChildBelongsToParent(msg.sender, child)); 
        parent_to_children[msg.sender].push(child);
    }
    
    function doingATask(uint _taskId) correctChild(_taskId) {
        Task memory task = id_to_task[_taskId];
        require(task.childDoing==0x0000000000000000000000000000000000000000);
        task.childDoing = msg.sender;
        id_to_task[_taskId] = task;
    }
    
    function completedATask(uint id) correctChild(id) {
        require(id_to_task[id].childDoing == msg.sender);
        id_to_task[id].completed = true;
    }
    
    function verifyTask(uint id) payable
        onlyParent(id) 
        checkEnough(id_to_task[id].payment) 
        refundIfExtra(id) {
        
        Task memory task = id_to_task[id];    
        require(task.completed);
        task.childDoing.transfer(task.payment);
    }
    
    //getters
    function getLatestTaskId() public view returns (uint) {
        return task_id;
    }

    function getCorrespondingTask(uint id) public view 
        returns (string, address, address, uint, bool) 
        {
        Task memory task = id_to_task[id];
        return (task.ipfsHash, task.parent, task.childDoing, task.payment, task.completed);
    }
    
    //helper methods.
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
    
    function doesChildBelongsToTask(uint id, address child) internal view returns(bool) {
        address parent = id_to_task[id].parent;
        return doesChildBelongsToParent(parent, child);
    }
}