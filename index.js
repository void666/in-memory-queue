'use strict';
const queueService = require('./services/queue.service');
const messageService = require('./services/message.service');
const consumerService = require('./services/consumer.service');
const topicService = require('./services/topic.service');
const config = require('./config');

module.exports = {
    createConsumer: consumerService.createConsumer,
    createMessage: messageService.createMessage,
    createTopic: topicService.createTopic,
    setQueueConfiguration: config.setQueueConfiguration,
    getStatus: queueService.getStatus
};