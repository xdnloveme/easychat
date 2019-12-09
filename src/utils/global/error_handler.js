/**
 * @file 全局错误
 * @author tangyida <530063113@qq.com>
 */

const { ServiceError, HttpError } = require('../errorHandle/');

global.ServiceError = ServiceError;
global.HttpError = HttpError;

module.exports = {
    ServiceError,
    HttpError,
};