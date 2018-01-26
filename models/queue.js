'use-strict';
var _ = require('lodash');

class Queue {
    constructor(size, retries){
        this._size = size;
        this._retries = retries;
        this._queue = [];
    }

    setSize(value){
        this._size = value;
    }

    setRetries(value){
        this._retries = 0
    }

    getSize(){
        return this._size;
    }

    getRetries(){
        return this._retries;
    }

    deQueue(){
        if(_.isEmpty(this._queue)){
            return null;
        }
        return this._queue.pop();
    }

    enQueue(message){
        this._queue.unshift(message);
    }

    messagesInQueue(){
        return this._queue.length;
    }

    isEmpty(){
        return _.isEmpty(this._queue);
    }

    status(){
        console.log(
            `Size : ${this.getSize()}, Messages in Queue : ${this.messagesInQueue()}, Retries : ${this.getRetries()}`
        );
        return;
    }
}

module.exports = Queue;