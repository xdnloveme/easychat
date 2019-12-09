/**
 * @file 用户模块路由入口
 * @author tangyida <530063113@qq.com>
 */

const Router = require('koa-router');
const userService_router = require('./user');
const login_router = require('./login');
const public_router = require('./public');

const user_router = new Router({
    prefix: '/user'
});

user_router
.use(userService_router.routes())
.use(login_router.routes())
.use(public_router.routes())

module.exports = user_router
