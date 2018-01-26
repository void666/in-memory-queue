'use-strict';
var shortId = require('shortid');


class Message {
    constructor(topic) {
        this._id = shortId.generate();
        this._topic = topic;
        this._created = new Date().valueOf();
        this._value = '';
        this._processing_details = [];
        this._processed = false;
        this._allowed_retries = 0;
    }

    getTopic() {
        return this._topic;
    }

    setValue(value) {
        this._value = value;
    }

    getValue() {
        return this._value;
    }

    getId() {
        return this._id;
    }

    setProcessingDetails(processingDetails) {
        this._processing_details = processingDetails;
    }

    getProcessingDetails() {
        return this._processing_details;
    }

    getCreated() {
        return this._created;
    }

    getProcessed() {
        return this._processed;
    }

    setProcessed(value) {
        this._processed = value;
    }

    setAllowedRetries(value) {
        this._allowed_retries = value;
    }

    getAllowedRetries() {
        return this._allowed_retries;
    }
}

module.exports = Message;