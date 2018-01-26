'use strict';
const _ = require('lodash');
const isJSON = function (str) {
    try {
        const obj = JSON.parse(str);
        if (obj && typeof obj === 'object' && obj !== null) {
            return true;
        }
    } catch (err) {
        return false;
    }
    return false;
};

const isPositiveNumber = function (value) {
    if ((!parseInt(value) || value <= 0)) {
        return false;
    }
    return true;
};

const isValidFunction = function (obj) {
    return _.isFunction(obj);
};

module.exports = {
    isJSON,
    isPositiveNumber,
    isValidFunction
};