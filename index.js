var queueService = require('/services/queue.service');
var messageService = require('/services/message.service');
var consumerService = require('/services/consumer.service');
var topicService = require('/services/topic.service');

var IMQInterface = {
    createConsumer : consumerService.createConsumer,
    createMessage : messageService.createMessage,
    createTopic : topicService.createTopic,
    QUEUE_CONFIGURATION : queueService.QueueConfiguration,
    getStatus : queueService.getStatus
};

module.exports = IMQInterface;