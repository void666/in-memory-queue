var Message = require('../models/message');
var topicService = require('./topic.service');
var queueService = require('./queue.service');
var _ = require('lodash');
var utils = require('../utilities/util');
var Promise = require('bluebird');
var consumerService = require('./consumer.service');

var createMessage = function (topic, json) {
    return validateMessageComponent(topic, json)
        .then(()=> {
            var message = new Message(topic);
            message.setValue(json);
            // console.log(message);
            return queueService.pushMessageToQueue(message)
                .then(()=> {
                    return ({success: true});
                })
                .catch((err) => {
                    console.log('Unable to push message to queue :', message.getId(), err);
                    return ({success: false, err: err});
                });
        });
};

var validateMessageComponent = function (topic, json) {
    if (!topicService.isValidTopic(topic)) {
        return Promise.reject(`Invalid topic for message : ${topic}`);
    }
    else if (!utils.isJSON(json)) {
        return Promise.reject(`Invalid json value for message : ${json}`);
    }
    else {
        return Promise.resolve();
    }
};

var test = function () {
    var arr = [];

    for(var i =1; i<=5 ;i++){
        var msgJson = {
            code: i,
            value: "message " + i
        };
        arr.push(createMessage('topic4', JSON.stringify(msgJson)));
    };
};

queueService.QueueConfiguration.size = 100;
queueService.QueueConfiguration.maxRetry = 9;
topicService.createTopic('topic1');
topicService.createTopic('topic4');
consumerService.createConsumer('topic1', 1, function(message){
    console.log(`Message received at consumer for topic1 message`);
    return Promise.resolve();
});
consumerService.createConsumer('topic1', 1, function(message){
    console.log(`Message received at consumer for topic1 message`);
    return Promise.resolve();
});
consumerService.createConsumer('topic1', 2, function(message){
    console.log(`Message received at consumer for topic1 message`);
    return Promise.resolve();
});
consumerService.createConsumer('topic1', 3, function(message){
    console.log(`Message received at consumer for topic1 message`);
    return Promise.resolve();
});
consumerService.createConsumer('topic4', 2, function (message) {
    console.log(`In consumer handler with priority 2, this will be rejected for topic1 for message ${message.getId()}`);
    return Promise.reject(`this will be rejected for topic4 for message ${message.getId()}`);
});
consumerService.createConsumer('topic4', 99, function (message) {
    console.log(`In consumer handler with priority 99, this will be rejected for topic4 for message ${message.getId()}`);
    return Promise.reject(`this will be rejected for topic1 for message ${message.getId()}`);
});
test();
// topicService.createTopic('topic1');
// test();
module.exports = {
    createMessage: createMessage,
};
