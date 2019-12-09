/**
 * @file 注册操作路由
 * @author tangyida <530063113@qq.com>
 */

const Router = require('koa-router');
const login = require('@src/controller/user/login');

const login_router = new Router();

// 登出服务
login_router.post('/logout', login.logout);

// 鉴定用户
login_router.post('/authToken', login.authToken);


module.exports = login_router;