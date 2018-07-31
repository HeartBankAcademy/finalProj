# Task Management - Consensys Academy Final Project

## A Casual Introduction
I am back at my home for my university summer break. Before my mother goes to work, she gives me a few tasks to do. And obviously she comes back in the evening to find out that I forgot some of them.  And since I had to do a final project, why not make it this. **A web based task assigning and management system that families can use to pay allowances to their children** 

But then again, why limit it just to parents and children? This system can be used by ANYONE to assign tasks to ANYONE!

The incentive of cryptocurrency is added into the system. The intial idea was to create an ERC20 Token for this. However, an ERC20 Token limits what you can do with your earned reward. Today's computer era is always all about giving people the most number of options. Allowing young children to be able to do anything they want with ether i.e HODL/invest in other tokens etc. seemed like an interesting idea to me as this could also allow them to understand finance. More importantly, this could be an easy way for many folks to enter into the crypto-currency world.

There is also the possibility of taking a look at all the tasks associated to you by entering your ethereum address. This way, you can always keep track of what tasks you need to do, or what tasks you need to verify. Additionally this also allows you to keep track of all the tasks that you assigned.

And ofcourse, all task details have been stored on IPFS, because storing data onto a blockchain isn't a good practise. The IPFS hashes corresponding to the tasks are stored onto the ethereum blockchain.

Having this sytem on the blockchain means that no one can argue that they hadn't been told of a task, and neither can a task-creator get away with not paying a task-doer. That is the removal of so much hassle for freelancers!

## Deeper Dive
I have taken care to store as less items in the contract as possible, doing as much as off-chain computing as possible by using IPFS.

#### HOW IT WORKS/STEPS ON WORKING ON THE TASK SYSTEM:

1. Add the person/people who you want to assign the task to
These addresses are stored in the mapping. This is crucial to only limit certain people to be able to do your tasks.

2. Add the task (with all the relevant details such as the task description, the reward you are willing to offer, the deadline and even an image if you want to upload it.)

All these details are stored in IPFS in a JSON structure as reiterated earlier. Firstly the image is stored onto the IPFS and its hash is added onto the JSON of the task. Finally this JSON is stored onto the IPFS. The hash thus generated is added into the task struct for this task id. (There exists a mapping between the task ids, and their structs.) The struct also stores the address of the creator of the task. 

3. Off the chain, you tell others the task ids of the tasks they must do.

4. Anyone may look up the task details by entering the relevant task id. 

The mapping between task ids and its struct is used to fetch the ipfs hash for the task. Using IPFS-API, the JSON structure is fetched from IPFS, and it is data is presented in a table-format.

5. If there are multiple people who can do the task, these people talk amongst them (off-chain negotiation) to decide who will do the task. This person then enters the task id for the task that they will do.

Internally, the address of this user is stored as the person who is doing the task (in the Task struct for this task id)

6. After the task has been completed, the person who was doing the task must now mark the task as completed.

Once again, the user enters the task Id, which is used to find the corresponding Task struct, and after the modifiers complete the checking (i.e. the person doing the task is same as the person who is calling this function), the state of the struct is modified to reflect the change.

7. Finally the task creator "verifies the task" off-chain and then if satisfied, logs the task as verified and does the payment. 

The ether is sent to the person who was doing the task. As an added functionality, the task creator can decide to pay the initial amount (which is fetched using ipfs-api, since the JSON structure stores the reward), or the person can pay a different amount, if the task wasn't complete to his/her liking.

Finally, there is an additional functionality - the **DASHBOARD**. The user enters his/her ethereum address, and all the tasks associated with him/her appear in 5 different sections namely:

- Tasks you created, but aren't completed
- Tasks you created, that are completed, but not verified by you
- Tasks you created, that have been verified
- Tasks you are currently doing
- Tasks you have completed, but not yet verified by the task creator.

This is displayed by listening to various events that are fired as users interact with the system. The events help to filter and categorize a task into one of the 5 tables. Using IPFS-API, relevant details are once again fetched.

**NOTE:** 
A mapping `parentToChildren` stores an array of addresses that may do tasks for a "parent" (or task-creator). I had given much thought into the idea of showing up any tasks onto the dashboard of a "child", that has been created by a "parent" (i.e. the person who once added the child into their mapping). This way a task-creator wouldn't ever have to tell anyone the task Id, as long as the person has been added by him into the mapping. 

HOWEVER, this is not practical. It is a high possibility that some tasks created aren't meant for a certain individual. Thus I have employed the most simple workaround - a task creator will tell task ids to all those who he/she thinks can do the task. 

## BUILD INSTRUCTIONS

After `git clone`,
``` 
$ cd react_ui
$ npm install
```
This fetches all the dependencies for my UI.
Since the contract is deployed already on `Rinkeby`, all left to be done is running a local server:
`$ npm run start` in the react_ui folder, and the UI should appear at `localhost:3000`

Additionally, you may deploy using `ganache-cli` with the following instructions:

On a terminal: `$ cd ganache-cli`
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
There are 13 tests written (in solidity and javascript) to test every aspect of the task management system. These tests may be found in the `tests` directory, and can be run using the `$ truffle test` command.
