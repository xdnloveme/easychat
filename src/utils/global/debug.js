/**
 * @file 调试模块
 * @author tangyida <530063113@qq.com>
 */

const debug = require('debug');

global.debug_redis = debug('easychat:redis');
global.debug_service = debug('easychat:service');

module.exports = debug;