const { ServiceError } = require('@src/utils/errorHandle/');
const { singleLoginAuth } = require('@src/service/user/login');
const { authCode } = require('@src/utils/errorHandle/code');

module.exports = () => {
  return async function(ctx, next) {
    try {
      // 匹配的是公共路由则直接跳过
      if (/^\/api(.*?)\/public/.test(ctx.url)) {
        return await next();
      }
      const token = ctx.request.header['authorization'];
      const payload = await singleLoginAuth(token);
      ctx.request['decode_payload'] = payload;
      await next();
    } catch (err) {
      if (401 === err.status) {
        debug_service(`权限认证失败:${err}`);
        const originalError = err.originalError;
        if (!originalError) {
          throw new ServiceError(1, '权限认证失败');
        }
        if (authCode.hasOwnProperty(originalError.name)) {
          debug_service(`验证失败类型为:${originalError}`);
          throw new ServiceError(authCode[originalError.name]);
        }
      }
      throw err;
    }
  };
};
