/**
 * @file socket通讯，聊天模块实现
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
const socket_server = require('@root/server/socket_server');

// 命名空间，路径 /chat
const square_io = socket_server.of('/chat');

module.exports = square_io