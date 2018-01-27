'use strict';
const utils = require('../utilities/util');
const Queue = require('../models/queue');
const async = require('async');
const handlerService = require('./message.handler.service');
const logger = require('../utilities/logger')('queue.service');
let QueueInstance = null;
let pollingLock = false;

/**
 * forever queue polling function.
 * @param next
 */
const startQueuePolling = function (next) {
    let message = null;
    while (!QueueInstance.isEmpty() && !pollingLock) {
        pollingLock = true;
        message = QueueInstance.deQueue();
        handlerService.processMessage(message)
            .then(message => {
                pollingLock = false;
                logger.info(`Processing of message successful for message id: ${message.getId()}`);
            })
            .catch(err => {
                logger.info(`Processing of message unsuccessful for message id: ${message.getId()}, err : ${err}`);
            });
    }
    next();
};

/**
 * Initialises Queue instance.
 *
 */
const initQueue = function () {
    const QueueConfiguration = require('../config').getQueueConfiguration();
    const size = QueueConfiguration.getSize();
    const maxRetry = QueueConfiguration.getMaxRetry();
    if (!utils.isPositiveNumber(size) || !utils.isPositiveNumber(maxRetry)) {
        throw new Error(`Invalid size or retry provided for Queue : size - ${size}, maxRetry - ${maxRetry}`);
    }
    if (!QueueInstance) {
        QueueInstance = new Queue(size, maxRetry);
    }
    logger.info(`Queue has been initialized with size : ${QueueInstance.getSize()} and maxRetries : ${QueueInstance.getRetries()}`);
    async.forever(startQueuePolling);
};

/**
 * Pushes pre-built message to the queue.
 * @param message
 * @return {*}
 */
const pushMessageToQueue = function (message) {
    if (!QueueInstance) {
        initQueue();
    }
    if (QueueInstance.messagesInQueue() === QueueInstance.getSize()) {
        return Promise.reject(`Queue is full`);
    }
    message.setAllowedRetries(QueueInstance.getRetries());
    QueueInstance.enQueue(message);
    logger.info(`Message ${message.getId()} successfully queued in`);
    return Promise.resolve();
};

const getStatus = function () {
    if (!QueueInstance) {
        initQueue();
    }
    QueueInstance.status();
};

module.exports = {
    pushMessageToQueue,
    getStatus
};
