'use strict';
const shortId = require('shortid');
const logger = require('../utilities/logger')('consumer');

class Consumer {
    constructor(topic, priority, handler) {
        this._id = shortId.generate();
        this._topic = topic;
        this._priority = priority;
        this._handler = handler;
    }

    getTopic() {
        return this._topic;
    }

    getId() {
        return this._id;
    }

    getHandler() {
        return this._handler;
    }

    getPriority() {
        return this._priority;
    }

    print() {
        return logger.info(`Consumer Details => Id : ${this.getId()},  Topic : ${this.getTopic()} , Priority : ${this.getPriority()}`);
    }
}

module.exports = Consumer;