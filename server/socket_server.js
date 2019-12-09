/**
 * @file socket服务器
 * @author tangyida <530063113@qq.com>
 */
const server = require('./server');
const io = require('socket.io');

const socket_server = io(server);

module.exports = socket_server;