# Task Management - Consensys Academy Final Project

## A Casual Introduction
I am back at my home for my university summer break. Before my mother goes to work, she gives me a few tasks to do. And obviously she comes back in the evening to find out that I forgot some of them.  And since I had to do a final project, why not make it this. **A web based task assigning and management system that families can use to pay allowances to their children** 

But then again, why limit it just to parents and children? This system can be used by ANYONE to assign tasks to ANYONE!

You can also keep track of what tasks you need to do, or what tasks you need to verify. Such a dashboard enabes you to track the status of each task!

The incentive of cryptocurrency is added into the system. The intial idea was to create an ERC20 Token for this. However, an ERC20 Token limits what you can do with your earned reward. Today's computer era is always all about giving people the most number of options, and giving rewards in ether does just that - you can HODL or even invest in other tokens. More importantly, this could be an easy way for many folks to enter into the crypto-currency world.

All task details have been stored on IPFS, because storing data onto a blockchain isn't a good practise. The IPFS hashes corresponding to the tasks are stored onto the ethereum blockchain.

Having this sytem on the blockchain means that no one can argue that they hadn't been told of a task, and neither can a task-creator get away with not paying a task-doer. That is the removal of so much hassle for freelancers!
![alt text](https://github.com/rahul-ki/finalProj/blob/master/pictures/instructions.JPG)
## Deeper Dive/ How to use the dApp
There are various sections in my dApp namely: **ADD A TASK, VIEW A TASK, DO A TASK, MARK TASK AS COMPLETED, VERIFY A TASK and the DASHBOARD - Seeing your tasks.**

1. Add the person/people who you want to assign the task to
This limits only these people to do the tasks.

2. Add the task (with all the relevant details such as the task description, the reward you are willing to offer, the deadline and even an image if you want to upload it.)

All these details are stored in IPFS in a JSON structure. And a task id for his task is generated. Internally, the ipfs hash, the person who created the task and other details (such as who is doing the task etc) is mapped with this task id. 

3. Off-chain, you tell others the task ids of the tasks they must do.

4. Anyone may look up the task details by entering the relevant task id. 

(The ipfs api uses the hash corresponding to this task id to fetch the relevant details)
![alt text](https://github.com/rahul-ki/finalProj/blob/master/pictures/add-view%20tasks.JPG)
5. If there are multiple people who can do the task, these people talk amongst them (off-chain negotiation) to decide who will do the task. This person then enters the task id for the task that they will do.

6.  If this person (who was doing the task) is done with the task, he/she must now mark the task as completed.

(Smart Contract checks that the address used to mark the task as completed is same as the address that was doing the task. This is done to prevent anyone else from sabotaging the task status.)
![alt text](https://github.com/rahul-ki/finalProj/blob/master/pictures/alert.JPG)

7. Finally the task creator "verifies the task" off-chain and then if satisfied, logs the task as verified and does the payment. 

The ether is sent to the person who was doing the task. As an added functionality, the task creator can decide to pay the initial amount (which is fetched using ipfs-api, since the JSON structure stores the reward), or the person can pay a different amount, if the task wasn't complete to his/her liking.

Now, about the **DASHBOARD** - The user hits the "see the tasks" button. The code retrieves the current metamask account that the user is using and all the tasks associated with him/her appear in 5 different sections namely:

- Tasks you created, but aren't completed
- Tasks you created, that are completed, but not verified by you
- Tasks you created, that have been verified
- Tasks you are currently doing
- Tasks you have completed, but not yet verified by the task creator.

This is displayed by listening to various events that are fired as users interact with the system. The events help to filter and categorize a task into one of the 5 tables. Using IPFS-API, relevant details are once again fetched.

![alt text](https://github.com/rahul-ki/finalProj/blob/master/pictures/dashboard.JPG)
## BUILD INSTRUCTIONS

First clone my repo using `git clone https://github.com/rahul-ki/finalProj`. Then,
``` 
$ cd react_ui
$ npm install
```
This fetches all the dependencies for my UI.
Since the contract is deployed already on `Rinkeby`, all left to be done is running a local server:
`$ npm run start` in the react_ui folder, and the UI should appear at `localhost:3000`

Alternatively, to work with my dApp with ganache-cli's private blockchain, follow these instructions:

On a terminal: `$ ganache-cli`
On another terminal, `cd` into the final project directory and 
``` 
$ truffle console
$ migrate
$ TaskManager.address
```
Copy this address and paste it into `line  3` of `contractSetup.js` in `react_ui/src/utils` folder.

Then `npm run start`
After that, connect the metamask account with the ganache-cli's private blockchain using its seed words.

### Testing
There are 14 tests written (in solidity and javascript) to test every aspect of the task management system. These tests may be found in the `tests` directory, and can be run using the `$ truffle test` command. The tests are to check that all modifiers are working and that no one can sabotage the life-cycle of a task (such as no one else but the person creating a task can pay, can't add someone who is already added etc.). There is also a test on the `Pausable.sol` contract that I have added. This ensures that my contract has a circuit break/ an emergency stop button. Only I (the deployer) can call this method.
