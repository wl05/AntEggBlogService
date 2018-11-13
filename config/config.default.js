'use strict'
const path = require('path')

module.exports = appInfo => {
    const config = exports = {}
    
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1540997103739_7974'
    config.static = {
        prefix : '/public/',
        dir : path.join(appInfo.baseDir, 'app/public')
    }
    
    // add your config here
    config.middleware = []
    config.mongoose = {
        client : {
            url : 'mongodb://127.0.0.1/ant_blog',
            options : {},
        },
    }
    // jwt
    config.jwt = {
        secret : "my.secret.my.secret.my.secret.my.secret"
    }
    // config cors
    config.security = {
        csrf : {
            enable : false,
            ignoreJSON : false
        },
        domainWhiteList : [ '*' ]
    }
    // config cors
    config.cors = {
        origin : '*',
        allowMethods : 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    }
    return config;
};
