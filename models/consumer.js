'use-strict';
var shortId = require('shortid');

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

    getHandler(){
        return this._handler;
    }

    getPriority(){
        return this._priority;
    }

    print(){
        return console.log(`Consumer Details => Id : ${this.getId()},  Topic : ${this.getTopic()} , Priority : ${this.getPriority()}`);
    }
};

module.exports = Consumer;