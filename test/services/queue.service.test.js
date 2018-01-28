'use strict';

const Queue = require('../../models/queue');
const config = require('../../config');
const queueService = require('../../services/queue.service');
const topicService = require('../../services/topic.service');
const messageService = require('../../services/message.service');
const _ = require('lodash');
const topic1 = 'topic11';
const json1 = '{ "code" : "JSON 1"}';


describe('queueService.getStatus', function () {
    it('it should getStatus of queue', () => {
        return queueService.getStatus()
            .then(obj => {
                expect(obj.size).equal(100);
                expect(obj.retries).equal(2);
                expect(obj.messages_in_queue).equal(0);
            });
    });
});

describe('queueService.pushMessageToQueue', function () {
    it('it should fail to push message of topic 1 to queue, missing queue configuration', () => {
        return topicService.createTopic(topic1)
            .then(() => {
                return messageService.createMessage(topic1, json1);
            })
            .catch(err => {
                expect(err.toString()).equal(err.toString());
            });
    });
    it('it should push message of topic 1 to queue', () => {
        config.setQueueConfiguration(29, 9);
        return messageService.createMessage(topic1, json1)
            .then(result => {
                expect(_.get(result, 'success')).equal(true);
            });
    });
    it('it should return null in for deQueue', function () {
        const q = new Queue(100, 1);
        const dequeResult = q.deQueue();
        expect(dequeResult).equal(null);
    });
});
