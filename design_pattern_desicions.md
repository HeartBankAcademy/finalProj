# DESIGN PATTERN DESICIONS

### Circuit Breaker
I have added OpenZeppelin's Pausable.sol to implement an emergency stop button. On the rinkeby network, only I can call the `pause()` method 
(since I have deployed it). As soon as the `pause()` method is called, none of my other methods can be performed since they all use the `whenNotPaused` modifier. This means no one can modify any of my state variables too. 

### Fail early and fail loud
Using `require` checks at the beginning of my methods allows only the right input parameters/ right addresses to interact, preventing any damage and reverting in case something is wrong.

### Restricting Access 
Appropriate usage of modifiers like `onlyParent` and `correctChild` only allow certain addresses to call certain methods. For example: only a parent call call `verifyATask()`. Similarly, only a particular child address added by a parent can do a task (i.e. call `doingATask()`).

### State Machine
Since like a state machine example, certain methods can only be done at certain stages, I have adopted this design pattern. For Example- `completedATask()` can only be called if some one is doing a task (i.e `childDoing` is not null). Similarly `verifyATask` can only be called if the task is completed (i.e. `task.completed == true`). 

This is ensured by calling `require` statements.

### Separate Data & Method Logic
A common design pattern is also to separate the parts of the contract that create and store all the state variables with the methods used to manipulate/modify the varibales. The `TaskHelper` contract defines all the state variables and the view methods, while the `TaskManager` contract deals with the methods that users interact with.

### Securing Payment method
I don't store any funds in the contract. All funds are immediately transferred to another address. I also don't user `transfer` but instead `send` which limits gas to 2300 in case any fallback method is called.
