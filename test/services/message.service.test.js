'use strict';

const topicService = require('../../services/topic.service');
const messageService = require('../../services/message.service');
const config = require('../../config');
const _ = require('lodash');
const topic1 = 't1';
const topic2 = 't2';
const json1 = '{ "code" : "JSON 1"}';
const invalidJson = {};

describe('messageService.createMessage', function () {
    it('it should not create message for topic 1, missing queue configuration', () => {
        return topicService.createTopic(topic1)
            .then(data => {
                return messageService.createMessage(topic1, json1)
                    .catch(err => {
                        expect(err.toString()).equal('Error: Queue configuration missing');
                    });
            });
    });
    it('it should not create message for topic 2, invalid topic', () => {
        return messageService.createMessage(topic2, json1)
            .catch(err => {
                expect(err.toString()).equal(`Invalid topic for message : ${topic2}`);
            });
    });
    it('it should not create message for topic , invalid topic', () => {
        return messageService.createMessage(topic1, invalidJson)
            .catch(err => {
                expect(err.toString()).equal(`Invalid json value for message : ${invalidJson}`);
            });
    });
    it('it should create message for topic 1', () => {
        config.setQueueConfiguration(100, 2);
        return messageService.createMessage(topic1, json1)
            .then(data => {
                const msg = _.get(data, 'message');
                const timestamp = msg.getCreated();
                expect(msg.getValue()).equal(json1);
                expect(timestamp).to.be.a('number');
            });
    });
});
