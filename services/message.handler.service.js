'use strict';
const topicService = require('./topic.service');
const _ = require('lodash');
const Promise = require('bluebird');
const logger = require('../utilities/logger')('message.handler.service');


const consumerMessageProcessor = function (context) {
    const messageProcessedDetails = context.message.getProcessingDetails();
    messageProcessedDetails[context.consumer.getId()] = messageProcessedDetails[context.consumer.getId()] || {
        processed: false,
        process_start: _.now(),
        retries: []
    };
    logger.info(`Processing handler function for ${context.message.getId()} and for consumer Id : ${context.consumer.getId()})`);
    return context.consumer.getHandler()(context.message)
        .then(() => {
            messageProcessedDetails[context.consumer.getId()].process_end = _.now();
            messageProcessedDetails[context.consumer.getId()].processed = true;
            context.message.setProcessingDetails(messageProcessedDetails);
            return Promise.resolve(context.message);
        })
        .catch(err => {
            if (context.message.getAllowedRetries() > context.retries) {
                context.retries += 1;
                logger.info(`Message processing failed at ${context.consumer.getId()}, retry count ${context.retries}`);
                return consumerMessageProcessor(context);
            }
            logger.info(`Message could not be processed after exhausting all retries ${context.message.getId()}`);
            messageProcessedDetails[context.consumer.getId()].process_end = _.now();
            messageProcessedDetails[context.consumer.getId()].processed = true;
            messageProcessedDetails[context.consumer.getId()].err = err;
            context.message.setProcessingDetails(messageProcessedDetails);
            return Promise.resolve(context);
        });
};

const processMessage = function (message) {
    if (message.getProcessed()) {
        logger.info(`Message already processed, no further processing needed`);
        return Promise.resolve(message);
    }
    return topicService.getConsumersForTopic(message.getTopic())
        .then(consumersForTopic => {
            if (_.isEmpty(consumersForTopic)) {
                logger.info(`No consumers found for topic ${message.getTopic()}`);
                message.setProcessed(true);
                message.setDropped(true);
                return Promise.resolve(message);
            } else {
                const consumersByPriority = _.groupBy(consumersForTopic, consumer => {
                    return consumer.getPriority();
                });
                const keys = (_.keys(consumersByPriority).sort());
                return Promise.mapSeries(keys, key => {
                    const thisLevelConsumers = consumersByPriority[key];

                    const promiseContexts = [];
                    _.each(thisLevelConsumers, consumer => {
                        const context = {};
                        context.consumer = consumer;
                        context.message = message;
                        context.retries = 0;
                        promiseContexts.push(consumerMessageProcessor(context));
                    });
                    return Promise.all(promiseContexts)
                        .then(() => {
                            logger.info(`All consumer with priority ${key}, processed for ${message.getId()}`);
                            return Promise.resolve(message);
                        });
                }).then(() => {
                    logger.info(`All consumer for all priorities processed message ${message.getId()}`, message);
                    message.setProcessed(true);
                    const queueService = require('./queue.service');
                    return queueService.pushMessageToProcessedMessage(message)
                        .then(() => {
                            return Promise.resolve(message);
                        });
                });
            }
        }).catch(err => {
            return Promise.reject(err);
        });
};

module.exports = {
    processMessage
};