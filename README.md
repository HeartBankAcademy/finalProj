# Task Management - Consensys Academy Final Project

## A Casual Introduction
I am back at my home for my university summer break. Before my mother goes to work, she gives me a few tasks to do. And obviously she comes back in the evening to find out that I forgot about all of them.  And since I had to do a final project, why not make it this. **A web based task assigning and management system that families can use to pay allowances to their children** 

But then again, why limit it just to parents and children? This system can be used by ANYONE to assign tasks to ANYONE!

The incentive of cryptocurrency is added into the system. The intial idea was to create an ERC20 Token for this. However, an ERC20 Token limits what you can do with your earned cash. Studying computer science, I was always left out of the crucial financial world, however the ability of managing money provides such an understanding. the child receiving ether using this syetm, can think if it is better to HODL or buy another token of it, or switch to another cryptocurrency too.

There is also the possibility of taking a look at all the tasks associated to you by entering your ethereum address.
## Deeper Dive
There are 6 steps in the process. I have taken care to store as less items in the contract as possible, doing as much as off-chain computing as possible and storing data on IPFS.

1. Add the person/people who you want to assign the task to
2. Add the task (with all the relevant details such as the task description, the reward you are willing to offer, the deadline and even an image if you want to upload it.)
All these details and the image too will be stored in IPFS as a JSON data structure (with the image, first that is stored in IPFS, and its hash is stored with the other details in the JSON structure). On adding the task, a table pops up with the task id, the ipfs hash where the JSON structure is stored and the ethereum transaction hash.

Off the chain, you tell others the task ids of the tasks they must do.
3. Anyone may look up the task details by entering the relevant task id. 
A mapping in my solidity contract stores the task ids with the relevant task struct. The task struct stores the ipfs Hash, who has created the task, who is doing the task and the status of the task.
The ipfs hash is fetched from the task id, the user enters, and ipfs-api is used to fetch the JSON data structure stored at this hash, and the data is presented in the form of a table.

4. If there are multiple people who can do the task, these people talk amongst them (off-chain negotiation) to decide who will do the task. This person then enters the task id for the task that they will do.
Internally, the address of this user is stored as the person who is doing the task (i.e. the Task struct is modified)

5. Once the task has been completed, it must be logged as so by the same account who was doing the task
Once again, the user enters the task Id, which is used to find the corresponding Task struct that after checking, it modifies the status of the task as completed.

6. Finally the task creator "verifies the task" off-chain and then if satisfied, logs the task as verified and does the payment. 
The ether is sent to the person who was doing the task. As an added functionality, the task creator can decide to pay the initial amount (which is fetched using ipfs-api, since the JSON structure stores the reward), or the person can write up a new amount.

Finally, there is an additional functionality - the **DASHBOARD**. The user enters his/her ethereum address, and all the tasks associated with him/her appear in 5 different sections namely:

- Tasks you created, but aren't completed
- Tasks you created, that are completed, but not verified by you
- Tasks you created, that have been verified
- Tasks you are currently doing
- Tasks you have completed, but not yet verified by the task creator.

Since ethereum is a public blockchain, it is necessary for the task creator to tell a potential task do-er the task id. 

The idea to simply display any tasks in your dashboard that have been created by someone who at some point had assigned you a task, doesn't work because even though at some point he/she may have given you a task, perhaps this task is not for you! 

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
