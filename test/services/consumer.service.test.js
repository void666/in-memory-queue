'use strict';

const consumerService = require('../../services/consumer.service');
const topicService = require('../../services/topic.service');
const topic1 = 'topic_1';
const topic2 = 'topic_2';
const topic3 = 'topic_3';

describe('consumerService.createConsumer', function () {

    it('it should create consumer with topic_1, priority 2', () => {
        topicService.createTopic(topic1);
        topicService.createTopic(topic2);
        topicService.createTopic(topic3);
        return consumerService.createConsumer(topic1, 2, function () {})
            .then(consumer => {
                expect(consumer.getTopic()).equal(topic1);
                expect(consumer.getPriority()).equal(2);
            });
    });
    it('it should fail to create, invalid topic', () => {
        return consumerService.createConsumer('invalid_topic', 2, function () {})
            .catch(err => {
                expect(err.toString()).equal('Topic not found invalid_topic');
            });
    });
    it('it should fail to create, invalid priority', () => {
        return consumerService.createConsumer(topic1, -1, function () {})
            .catch(err => {
                expect(err.toString()).equal('Priority must be a valid number and more than 0 : -1');
            });
    });
    it('it should not create topic 3, invalid handler', () => {
        return consumerService.createConsumer(topic1, 2)
            .catch(err => {
                expect(err.toString()).equal('Consumer handler must be function');
            });
    });
});