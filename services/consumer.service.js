'use strict';
const util = require('../utilities/util');
const topicService = require('./topic.service');
const Consumer = require('../models/consumer');
const logger = require('../utilities/logger')('consumer.service');

const validateConsumer = function (topic, priority, handler) {
    if (!topicService.isValidTopic(topic)) {
        return Promise.reject(`Topic not found ${topic}`);
    }
    if (!util.isPositiveNumber(priority)) {
        return Promise.reject(`Priority must be a valid number and more than 0 : ${priority}`);
    }
    if (!util.isValidFunction(handler)) {
        return Promise.reject(`Consumer handler must be function`);
    } else {
        return Promise.resolve();
    }
};

const createConsumer = function (topic, priority, handler) {
    return validateConsumer(topic, priority, handler)
        .then(() => {
            const consumer = new Consumer(topic, priority, handler);
            return topicService.registerConsumerForTopic(topic, consumer)
                .then(() => {
                    consumer.print();
                    logger.info(`Consumer created successfully`);
                    return Promise.resolve(consumer);
                });
        });
};

module.exports = {
    createConsumer
};