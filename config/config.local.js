'use strict';
exports.mongoose = {
    client: {
        url: 'mongodb://127.0.0.1:27017/ant_blog',
        options: {},
    },
};

// config redis
exports.redis = {
    client: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        password: '123123',
        db: 0,
    },
};

exports.baseUrl = 'http://127.0.0.1:7001';
exports.redirectActivationUrl = 'http://127.0.0.1:8080/activation';
