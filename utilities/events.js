var EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
// A minimal event emitter for now, which might evolve later.
    eventEmitter = new EventEmitter();

module.exports = eventEmitter;