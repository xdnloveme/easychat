/**
 * @file 注册操作路由
 * @author tangyida <530063113@qq.com>
 */

const Router = require('koa-router');
const userService = require('@src/controller/user/user');

const service_router = new Router();

service_router.get('/searchByOpenId', userService.searchByOpenId);

service_router.get('/getRecommendUser', userService.getRecommendUser);

// service_router.post('/addFriendsByOpenId', userService.addFriendsByOpenId);

service_router.get('/getContactsList', userService.getContactsList);

service_router.post('/modifyPublicInfo', userService.modifyPublicInfo);

module.exports = service_router;