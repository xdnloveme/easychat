/**
 * @file socket通讯，广场模块实现
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
const { connection } = require('./events');
const namespace = require('./namespace');
const AuthorizationSocket = require('@src/middlewares/AuthorizationSocket');

namespace
.use(AuthorizationSocket.authSocket())
.on('connection', connection)

module.exports = namespace;