# in-memory-queue 
#####  https://www.npmjs.com/package/in-memory-queue

### Properties :
  - Concurrent read and writes
  - Retry mechanism
  - Parallel and series processing of jobs based on consumer priority definition
  - Completely in-memory
  - Multiple consumer support
  - Topic wise job distribution
  - Supports consumer tasks as promises.
  - Auto start polling of queue, on first message.

### Interface : 
`setQueueConfiguration` : Takes two parameters , `size` and `maxRetry`, both positive integers.
Returns promise.

```
const imqueue = require('in-memory-queue');
imqueue.setQueueConfiguration(100, 2); 

 ```
   
    
`createTopic` : Creates a topic (string based pattern). Takes one parameter as string. Returns promise.

```
const imqueue = require('in-memory-queue');
const Promise = require('bluebird');
const topic = 'topic1';
imqueue.setQueueConfiguration(100, 2);
return imqueue.createTopic(topic).then((result)=>{ 
    if(result.topic === topic && result.success){
        console.log(`Topic got created {topic}`);
    }
    return;
});
```


`createMessage` :Creates a Message, takes two parameters, topic and stringified JSON. Returns promise.
```
const imqueue = require('in-memory-queue');
const Promise = require('bluebird');
const topic = 'topic1';
const jsonString = {code: 'json1'};
imqueue.setQueueConfiguration(100, 2);
return imqueue.createTopic(topic).then((result) => {
    return imqueue.createMessage(topic, JSON.stringify(jsonString))
        .then((result) => {
            let msg = result.message;
            console.log(`Message topic ${msg.getId()}`);
            console.log(`Message topic ${msg.getTopic()}`);
            console.log(`Message created timestamp ${msg.getCreated()}`);
            console.log(`Message allowed retries ${msg.getAllowedRetries()}`);
            console.log(`Message value ${msg.getValue()}`);
            console.log(`Message processed ${msg.getProcessed()}`);

        });
});
```


`createConsumer` : Creates a Consumer for a given topic. Accepts valid `topic`, `priority`(positive integer), `handler` (promisified function , with a message parameter);
```
const imqueue = require('in-memory-queue');
const Promise = require('bluebird');
imqueue.createConsumer('topic1', 1, function (msg) {
    console.log(`Handler task executing ${msg.getValue()}`);
    return Promise.resolve();
}).then((consumer)=> {
    console.log(`Consumer id ${consumer.getId()}`);
    console.log(`Consumer topic ${consumer.getTopic()}`);
    console.log(`Consumer priority ${consumer.getPriority()}`);
});

imqueue.createConsumer('topic1', 1, function (msg) {
    console.log(`Handler task executing ${msg.getValue()}`);
    return Promise.resolve();
}).then((consumer)=> {
    console.log(`Consumer id ${consumer.getId()}`);
    console.log(`Consumer topic ${consumer.getTopic()}`);
    console.log(`Consumer priority ${consumer.getPriority()}`);
});


imqueue.createConsumer('topic1', 2, function (msg) {
    console.log(`Handler task executing ${msg.getValue()}`);
    return Promise.resolve();
}).then((consumer)=> {
    console.log(`Consumer id ${consumer.getId()}`);
    console.log(`Consumer topic ${consumer.getTopic()}`);
    console.log(`Consumer priority ${consumer.getPriority()}`);
});
```
#### _Note_

>_The order of execution of each consumer depends on the increasing order of priority. Consumer handlers with priority 1 will be executed in parallel and then the consumer handler for priority 2 will be executed._ 

`getProcessedMessages` : Returns list of all messages processed so far. Returns promise.
```
const imqueue = require('in-memory-queue');
const Promise = require('bluebird');
const topic = 'topic1';
const jsonString = {code: 'json1'};
imqueue.setQueueConfiguration(100, 2);
return imqueue.createTopic(topic).then((result) => {
    return imqueue.createMessage(topic, JSON.stringify(jsonString))
        .then((result) => {
            let msg = result.message;
            console.log(`Message topic ${msg.getId()}`);
            console.log(`Message topic ${msg.getTopic()}`);
            console.log(`Message created timestamp ${msg.getCreated()}`);
            console.log(`Message allowed retries ${msg.getAllowedRetries()}`);
            console.log(`Message value ${msg.getValue()}`);
            console.log(`Message processed ${msg.getProcessed()}`);
            return Promise.resolve();
        }).then(() => {
            return imqueue.getProcessedMessages().then((result) => {
                let message = result[0];
                console.log(`Message processed ${message.getProcessed()}`);
                console.log(`Message Processing details ${message.getProcessingDetails()}`);
            });
        });
});

```

`getStatus` : gets the status of the present queue. Returns promise and prints the status in queue log
```
const imqueue = require('in-memory-queue');
imqueue.setQueueConfiguration(100, 2);
return imqueue.getStatus()
    .then((result)=> {
        console.log(`Queue size : ${result.size}`);
        console.log(`Message in queue : ${result.messages_in_queue}`); // returns the current number of message in queue
        console.log(`Queue max retrys : ${result.retries}`);
    });
```
### Installation : 

- add a referrence to `in-memory-queue` as follows in `package.json`:
    ```
    "dependencies": {
    "in-memory-queue": "git+https://github.com/void666/in-memory-queue.git"}
    ```
- do    `npm install`

### Test : 
- do `npm test`