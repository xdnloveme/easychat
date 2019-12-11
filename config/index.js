'use strict';
const env = require('./env');

Object.keys(env).map(item => {
  process.env[item] = env[item];
});

global.server_url = process.env.NODE_ENV === 'development' ? 'http://localhost:3003/' : 'http://chat.tangyida.top/';
