'use strict';
const _ = require('lodash');
const logger = require('../utilities/logger')('queue');

class Queue {
    constructor(size, retries) {
        this._size = size;
        this._retries = retries;
        this._queue = [];
        this._processed_messages = [];
    }

    getSize() {
        return this._size;
    }

    getRetries() {
        return this._retries;
    }

    deQueue() {
        if (_.isEmpty(this._queue)) {
            return null;
        }
        return this._queue.pop();
    }

    enQueue(message) {
        this._queue.unshift(message);
    }

    numberOfMessagesInQueue() {
        return this._queue.length;
    }

    isEmpty() {
        return _.isEmpty(this._queue);
    }

    status() {
        const obj = {
            size: this.getSize(),
            messages_in_queue: this.numberOfMessagesInQueue(),
            retries: this.getRetries(),
            processed_messages: this.getProcessedMessages().length
        };
        logger.info(
            `Size : ${this.getSize()}, Messages in Queue : ${this.numberOfMessagesInQueue()}, Retries : ${this.getRetries()}, Processed Messages : ${this.getProcessedMessages().length}`
        );
        return obj;
    }

    getProcessedMessages() {
        return this._processed_messages;
    }

    setProcessedMessages(processedMessages) {
        this._processed_messages = processedMessages;
    }
}

module.exports = Queue;