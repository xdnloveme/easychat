const { ServiceError, HttpError } = require('../utils/errorHandle/');

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err);
      let code = 500;
      let msg = '服务器内部发生未知错误,请联系管理员';
      let data = null;

      if (err instanceof ServiceError || err instanceof HttpError) {
        const res = err.getCodeMsg();
        ctx.status = err instanceof HttpError ? res.code : 200;
        code = res.code || code;
        msg = res.msg || msg;
        data = res.data || data;
      } else {
        console.error('err', err);
      }
      debug_service(`全局统一错误处理,code: ${code}, msg: ${msg}`);
      ctx.state.response.error(code, msg, data);
    }
  };
};
