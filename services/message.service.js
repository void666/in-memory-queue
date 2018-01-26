'use strict';
const Message = require('../models/message');
const topicService = require('./topic.service');
const queueService = require('./queue.service');
const utils = require('../utilities/util');
const Promise = require('bluebird');
const logger = require('../utilities/logger');

const validateMessageComponent = function (topic, json) {
    if (!topicService.isValidTopic(topic)) {
        return Promise.reject(`Invalid topic for message : ${topic}`);
    } else if (!utils.isJSON(json)) {
        return Promise.reject(`Invalid json value for message : ${json}`);
    } else {
        return Promise.resolve();
    }
};

const createMessage = function (topic, json) {
    return validateMessageComponent(topic, json)
        .then(() => {
            const message = new Message(topic);
            message.setValue(json);
            return queueService.pushMessageToQueue(message)
                .then(() => {
                    return ({ success: true });
                })
                .catch(err => {
                    logger.error('Unable to push message to queue :', message.getId(), err);
                    return ({ success: false, err });
                });
        });
};

module.exports = {
    createMessage
};
