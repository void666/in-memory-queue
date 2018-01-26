var utils = require('../utilities/util');
var _ = require('lodash');
var Queue = require('../models/queue');
var topicService = require('./topic.service');
var async = require('async');
var handlerService = require('./message.handler.service');

var QueueConfiguration = {
    size: 200,
    maxRetry: 3
};

var QueueInstance = null;
var pollinglock = false;

var startQueuePolling = function (next) {
    while (!QueueInstance.isEmpty() && !pollinglock) {
        pollinglock = true;
        var message = QueueInstance.deQueue();
        handlerService.processMessage(message)
            .then((message)=> {
                pollinglock = false;
                console.log(`Processing of message successful for message id: ${message.getId()}`);
            })
            .catch((err)=> {
                console.log(`Processing of message unsuccessful for message id: ${message.getId()}, err : ${err}`);
            });
    }
    next();
};

var initQueue = function () {
    var size = _.get(QueueConfiguration, 'size');
    var maxRetry = _.get(QueueConfiguration, 'maxRetry');

    if (!utils.isPositiveNumber(size) || !utils.isPositiveNumber(maxRetry)) {
        throw new Error(`Invalid size or retry provided for Queue : size - ${size}, maxRetry - ${maxRetry}`);
    }
    if (!QueueInstance) {
        QueueInstance = new Queue(size, maxRetry);
    }
    console.log(`Queue has been initialized with size : ${QueueInstance.getSize()} and maxRetries : ${QueueInstance.getRetries()}`);
    QueueInstance.status();
    async.forever(startQueuePolling, function (err) {});
};

var pushMessageToQueue = function (message) {
    if (!QueueInstance) {
        initQueue();
    }
    if (QueueInstance.messagesInQueue() == QueueInstance.getSize()) {
        return Promise.reject(`Queue is full`);
    }
    message.setAllowedRetries(QueueInstance.getRetries());
    QueueInstance.enQueue(message);
    console.log(`Message ${message.getId()} successfully queued in`);
    return Promise.resolve();
};


module.exports = {
    pushMessageToQueue: pushMessageToQueue,
    QueueConfiguration: QueueConfiguration
};
