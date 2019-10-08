'use strict';
const _ = require('lodash');
const logger = require('../utilities/logger')('topic.service');
const topicVsConsumer = {};

const isValidTopic = function (topic) {
    if (_.get(topicVsConsumer, topic)) {
        return true;
    }
    return false;
};

const createTopic = function (topic) {
    if (_.get(topicVsConsumer, topic, false)) {
        return Promise.reject(`Topic already exists ${topic}`);
    } else {
        topicVsConsumer[topic] = [];
        logger.info(`Topic created successfully ${topic}`);
        return Promise.resolve({ success: true, topic });
    }
};

const registerConsumerForTopic = function (topic, consumer) {
    if (isValidTopic(topic)) {
        topicVsConsumer[topic].push(consumer);
        logger.info(`Consumer ${consumer.getId()} registered for topic : ${topic}`);
        return Promise.resolve({ success: true });
    } else {
        return Promise.reject(`Topic not found ${topic}`);
    }
};

const getConsumersForTopic = function (topic) {
    if (!isValidTopic(topic)) {
        return Promise.reject(`Topic not found ${topic}`);
    }
    return Promise.resolve(topicVsConsumer[topic]);
};

const getTopics = function () {
    const topics = Object.keys(topicVsConsumer);
    if (topics.length === 0) {
        return Promise.reject(`No topics created`);
    } else {
        return Promise.resolve(topics);
    }
}

module.exports = {
    isValidTopic,
    createTopic,
    registerConsumerForTopic,
    getConsumersForTopic,
    getTopics
};
