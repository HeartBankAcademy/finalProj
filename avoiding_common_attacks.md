# Avoiding Common Attacks

### Integer Overflow
To prevent Integer overflow of `taskId`, I have used OpenZeppelin's `SafeMath.sol`.

### Reentrancy Attack
Reentrancy attack suggests doing all internal work first and only then call external contract methods, or functions like `send()`. I have used this logic in `verifyATask()` to set the task as verfied and only then transfer funds from the parent to the task doer.
