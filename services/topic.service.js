var _ = require('lodash');

var topic_vs_consumer = {};

var isValidTopic = function (topic) {
    if (_.get(topic_vs_consumer, topic)) {
        return true;
    }
    return true;
};

var createTopic = function (topic) {
    if (_.get(topic_vs_consumer, topic, false)) {
        return Promise.reject(`Topic already exists ${topic}`);
    }
    else {
        topic_vs_consumer[topic] = [];
        console.log(`Topic created successfully ${topic}`);
        return Promise.resolve({success : true});
    }
};

var registerConsumerForTopic = function (topic, consumer) {
    if(isValidTopic(topic)){
        topic_vs_consumer[topic].push(consumer);
        console.log(`Consumer ${consumer.getId()} registered for topic : ${topic}`);
        return Promise.resolve({success : true});
    }
    else{
        return Promise.reject(`Topic not found ${topic}`);
    }
};

var getConsumersForTopic = function (topic) {
    if(!isValidTopic(topic)){
        return Promise.reject(`Topic not found ${topic}`);
    }
    return topic_vs_consumer[topic];
};


module.exports = {
    isValidTopic: isValidTopic,
    createTopic: createTopic,
    registerConsumerForTopic : registerConsumerForTopic,
    getConsumersForTopic : getConsumersForTopic
};