/**
 * @file 程序入口文件
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
require('module-alias/register')

const Koa = require('koa');
const Boom = require('boom');
const app = new Koa();
const router = require('./router/index');
const bodyParser = require('koa-bodyparser');
const koaJwt = require('koa-jwt');
const response = require('./utils/responseContent');
const views = require('koa-views')
const path = require('path');

// 全局配置优先级高，放在代码前面
require('./utils/global/');

// 本地中间件的引用
const unifiedErrorHandle = require('./middlewares/UnifiedErrorHandle');
const crossDomain = require('./middlewares/CrossDomain');
const authorization = require('./middlewares/Authorization')

app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

// 使用koa-bodyparser做post请求的数据处理中间件（解析到ctx.request.body）
app.use(bodyParser());

// 跨域设置
app.use(crossDomain())

// 统一错误处理
app.use(unifiedErrorHandle());

// 设置返回数据的统一格式，默认是200
app.use(response.createInterface());

// 权限鉴定
app.use(authorization());

app.use(koaJwt({ secret: 'easychat-jwt_api-auth_Tang-Yi-Da'})
.unless({
    path:[ /^\/api(.*?)\/public/ ]
}))

// 统一路由入口
app.use(router.routes()).use(router.allowedMethods({
  throw: true,
  notImplemented: () => {
    const BoomNT = Boom.notImplemented();
    throw new HttpError(BoomNT.output.statusCode)
  },
  methodNotAllowed: () => {
    const BoomNA = Boom.methodNotAllowed();
    throw new HttpError(BoomNA.output.statusCode)
  }
}))

module.exports = app;
