'use strict';

const topicService = require('../../services/topic.service');
const consumerService = require('../../services/consumer.service');
const _ = require('lodash');
const topic1 = 'topic-1';
const topic2 = 'topic-2';
const topic3 = 'topic-3';

describe('topicService.createTopic', function () {
    it('it should create topic 1', () => {
        return topicService.createTopic(topic1)
            .then(data => {
                expect(_.get(data, 'success')).equal(true);
                expect(_.get(data, 'topic')).equal(topic1);
            });
    });
    it('it should fail to recreate topic 1', () => {
        return topicService.createTopic(topic1)
            .catch(err => {
                expect(err.toString()).equal('Topic already exists topic-1');
            });
    });
    it('it should create topic 2', () => {
        return topicService.createTopic(topic2)
            .then(data => {
                expect(_.get(data, 'success')).equal(true);
                expect(_.get(data, 'topic')).equal(topic2);
            });
    });
    it('it should create topic 3', () => {
        return topicService.createTopic(topic3)
            .then(data => {
                expect(_.get(data, 'success')).equal(true);
                expect(_.get(data, 'topic')).equal(topic3);
            });
    });
});

describe('topicService.registerConsumerForTopic', function () {
    it('it should register consumer for topic 1', () => {
        return consumerService.createConsumer(topic1, 2, function () {
        }).then(consumer => {
            expect(consumer.getTopic()).equal(topic1);
            expect(consumer.getPriority()).equal(2);
        });
    });
    it('it should not register consumer for topic 1', () => {
        return topicService.registerConsumerForTopic('invalid', null)
            .catch(err => {
                expect(err.toString()).equal('Topic not found invalid');
            });
    });
});

describe('topicService.getConsumerForTopic', function () {
    it('it should get consumer for topic 1', () => {
        return topicService.getConsumersForTopic(topic1)
            .then(results => {
                expect(results[0].getTopic()).equal(topic1);
            });
    });
    it('it should not get any consumers for topic 1', () => {
        return topicService.getConsumersForTopic('invalid topic')
            .catch(err => {
                expect(err.toString()).equal('Topic not found invalid topic');
            });
    });
});