var topicService = require('./topic.service');
var _ = require('lodash');
var Promise = require('bluebird');


var consumerMessageProcessor = function (context) {
    var messageProcessedDetails = context.message.getProcessingDetails();
    messageProcessedDetails[context.consumer.getId()] = messageProcessedDetails[context.consumer.getId()] || {
            processed: false,
            process_start: _.now(),
            retries: []
        };
    console.log(`Processing handler function for ${context.message.getId()} and for consumer Id : ${context.consumer.getId()})`);
    return context.consumer.getHandler()(context.message)
        .then(function () {
            messageProcessedDetails[context.consumer.getId()].process_end = _.now();
            messageProcessedDetails[context.consumer.getId()].processed = true;
            return Promise.resolve(context.message);
        })
        .catch((err) => {
            if (context.message.getAllowedRetries()>context.retries) {
                context.retries += 1;
                console.log(`Message processing failed at ${context.consumer.getId()}, retry count ${context.retries}`);
                return consumerMessageProcessor(context);
            }
            console.log(`Message could not be processed after exhausting all retries ${context.message.getId()}`);
            messageProcessedDetails[context.consumer.getId()].process_end = _.now();
            messageProcessedDetails[context.consumer.getId()].processed = true;
            messageProcessedDetails[context.consumer.getId()].err = err;
            context.message.setProcessingDetails(messageProcessedDetails);
            return Promise.resolve(context);
        });
};

var processMessage = function (message) {
    if (message.getProcessed()) {
        console.log(`Message already processed, no further processing needed`);
        return Promise.resolve(message)
    }
    var consumersForTopic = topicService.getConsumersForTopic(message.getTopic());
    if (_.isEmpty(consumersForTopic)) {
        console.log(`No consumers found for topic ${message.getTopic()}`);
        message.setProcessed(true);
        return Promise.resolve(message);
    }
    else {
        var consumersByPriority = _.groupBy(consumersForTopic, function (consumer) {
            return consumer.getPriority();
        });
        var keys = (_.keys(consumersByPriority).sort());
        return Promise.mapSeries(keys, function (key) {
            var thisLevelConsumers = consumersByPriority[key];

            var promiseContexts = [];
            _.each(thisLevelConsumers, function (consumer) {
                var context = {};
                context.consumer = consumer;
                context.message = message;
                context.retries = 0;
                promiseContexts.push(consumerMessageProcessor(context));
            });
            return Promise.all(promiseContexts)
                .then((result) => {
                    console.log(`All consumer with priority ${key}, processed for ${message.getId()}`);
                    return Promise.resolve(message);
                });
        }).then((result)=> {
            console.log(`All consumer for all priorities processed message ${message.getId()}`, message);
            return Promise.resolve(message);
        });
    }
};

module.exports = {
    processMessage: processMessage
};