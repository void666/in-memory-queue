var _ = require('lodash');
var isJSON = function (str) {
    try {
        var obj = JSON.parse(str);
        if (obj && typeof obj === 'object' && obj !== null) {
            return true;
        }
    } catch (err) {
        return false;
    }
    return false;
};

var isPositiveNumber = function (value) {
    if ((!parseInt(value) || value <= 0)) {
        return false;
    }
    return true;
};

var isValidFunction = function (obj) {
    return _.isFunction(obj);
};

module.exports = {
    isJSON: isJSON,
    isPositiveNumber: isPositiveNumber,
    isValidFunction: isValidFunction
};