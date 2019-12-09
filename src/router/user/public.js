/**
 * @file 公开路由
 * @author tangyida <530063113@qq.com>
 */

const Router = require('koa-router');
const register = require('@src/controller/user/register');
const login = require('@src/controller/user/login');

const public_router = new Router({
    prefix: '/public'
});

// 添加新的注册用户
public_router.post('/register', register.insertNewUser);

// 注册后的激活页面
public_router.get('/active', register.activeUser);

// 生成新的激活码，重新激活（第二个为restful风格的）
public_router.get('/createActiveKey', register.createActiveKey);
public_router.get('/createActiveKeyRestful', register.createActiveKeyRestful);

// 判断用户名是否被注册
public_router.get('/isUsernameRegister', register.isUsernameRegister);

// 登录服务
public_router.post('/login', login.login);

// 检验激活码的正确与否
public_router.post('/veryifyActiveKey', register.veryifyActiveKey);


module.exports = public_router;