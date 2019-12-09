/**
 * @file 用户头像路由入口
 * @author tangyida <530063113@qq.com>
 */

const Router = require('koa-router');
const avatar = require('@src/controller/avatar');

const avatar_router = new Router({
    prefix: '/avatar'
});

avatar_router.get('/getList', avatar.getAvatarList)

module.exports = avatar_router
