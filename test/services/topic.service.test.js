'use strict';

const topicService = require('../../services/topic.service');
const _ = require('lodash');
const topic1 = 'topic_1';
const topic2 = 'topic_2';
const topic3 = 'topic_3';

describe('createTopic', function () {
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
                expect(err).equal(err);
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