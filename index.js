'use strict';
const config = require('./config');
const queueService = require('./services/queue.service');
const messageService = require('./services/message.service');
const consumerService = require('./services/consumer.service');
const topicService = require('./services/topic.service');

module.exports = {
    setQueueConfiguration: config.setQueueConfiguration,
    createConsumer: consumerService.createConsumer,
    createMessage: messageService.createMessage,
    createTopic: topicService.createTopic,
    getStatus: queueService.getStatus
};