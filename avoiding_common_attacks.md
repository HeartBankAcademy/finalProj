# Avoiding Common Attacks

### Integer Overflow
To prevent Integer overflow of `taskId`, I have used OpenZeppelin's `SafeMath.sol`.

### Reentrancy Attack
Reentrancy attack suggests doing all internal work first and only then call external contract methods, or functions like `send()`. I have used this logic in `verifyATask()` to set the task as verfied and only then transfer funds from the parent to the task doer.

### Securing Vulnerabilities
Done by keeping my contract as simple as possible, and not using tx.origin, block hashes etc. that may expose methods or allow miners to influence any process.

Lastly, by using `send` and not methods like `transfer` to move funds, I keep my contract secure since any fallback method thus executed will have a gas limit of 2300.
