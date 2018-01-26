'use strict';
const queueService = require('./services/queue.service');
const messageService = require('./services/message.service');
const consumerService = require('./services/consumer.service');
const topicService = require('./services/topic.service');

const IMQInterface = {
    createConsumer: consumerService.createConsumer,
    createMessage: messageService.createMessage,
    createTopic: topicService.createTopic,
    QUEUE_CONFIGURATION: queueService.QueueConfiguration,
    getStatus: queueService.getStatus
};

module.exports = IMQInterface;