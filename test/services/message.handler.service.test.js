'use strict';

const topicService = require('../../services/topic.service');
const consumerService = require('../../services/consumer.service');
const messageHandlerService = require('../../services/message.handler.service');
const Message = require('../../models/message');
const config = require('../../config');
const topic1 = 't11';
const json1 = '{ "code" : "JSON 1"}';

describe('messageHandlerService.processMessage', function () {
    it('it should process message, no consumer found', () => {
        config.setQueueConfiguration(100, 2);
        return topicService.createTopic(topic1)
            .then(() => {
                const message1 = new Message(topic1);
                message1.setValue(json1);
                return messageHandlerService.processMessage(message1)
                    .then(message1 => {
                        expect(message1.getProcessed()).equal(true);
                    });
            });
    });
    it('it should process message, message already processed', () => {
        const message1 = new Message(topic1);
        message1.setProcessed(true);
        return messageHandlerService.processMessage(message1)
            .then(message1 => {
                expect(message1.getProcessed()).equal(true);
            });
    });
    it('it should process message, consumer found', () => {
        const promises = [];
        promises.push(consumerService.createConsumer(topic1, 1, function (message) {
            return Promise.resolve(console.log(`Processed message successfully in handler function`));
        }));
        promises.push(consumerService.createConsumer(topic1, 2, function (message) {
            return Promise.resolve(console.log(`Processed message successfully in handler function`));
        }));
        promises.push(consumerService.createConsumer(topic1, 3, function (message) {
            return Promise.reject(console.log(`Message will be rejected in this handler`));
        }));
        promises.push(consumerService.createConsumer(topic1, 3, function (message) {
            return Promise.reject(console.log(`Message will be rejected in this handler`));
        }));
        Promise.all(promises).then(() => {
            const message1 = new Message(topic1);
            message1.setAllowedRetries(2);
            message1.setValue(json1);
            return messageHandlerService.processMessage(message1)
                .then(message1 => {
                    expect(message1.getProcessed()).equal(true);
                });
        });
    });
    it('it should not process message, invalid topic', () => {
        const message1 = new Message('invalid');
        return messageHandlerService.processMessage(message1)
            .catch(err => {
                expect(err.toString()).equal(`Topic not found invalid`);
            });
    });
});
