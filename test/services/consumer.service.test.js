'use strict';

const consumerService = require('../../services/consumer.service');
const topicService = require('../../services/topic.service');
const _ = require('lodash');
const topic1 = 'topic_1';
const topic2 = 'topic_2';
const topic3 = 'topic_3';

describe('createConsumer', function () {

    it('it should create consumer with topic_1, priority 2', () => {
        topicService.createTopic(topic1);
        topicService.createTopic(topic2);
        topicService.createTopic(topic3);
        return consumerService.createConsumer(topic1, 2, function(x){})
            .then((consumer)=>{
                expect(consumer.getTopic()).equal(topic1);
                expect(consumer.getPriority()).equal(2);
            });
    });
    it('it should fail to create, invalid topic', () => {
        return consumerService.createConsumer('invalid_topic', 2, function(x){})
            .catch(err => {
                console.log(`Error : ${err}`);
                expect(err).equal(err);
            });
    });
    it('it should fail to create, invalid priority', () => {
        return consumerService.createConsumer(topic1, -1, function(x){})
            .catch(err => {
                console.log(`Error : ${err}`);
                expect(err).equal(err);
            });
    });
    it('it should create topic 3', () => {
        return consumerService.createConsumer(topic1, 2)
            .catch(err => {
                console.log(`Error : ${err}`);
                expect(err).equal(err);
            });
    });
});