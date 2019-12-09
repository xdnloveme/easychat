/**
 * @file 路由整合文件（入口）
 * @author tangyida <530063113@qq.com>
 */

const Router = require('koa-router')
const user = require('./user');
const avatar = require('./avatar');

// 统一使用koa-router进行路由处理
const router = new Router({
    prefix: '/api'
})

// 每个路由模块的顶层封装，装载所有子路由
router
.use(user.routes())
.use(avatar.routes());

module.exports = router;
