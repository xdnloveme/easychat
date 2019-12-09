/**
 * @file 统一的返回内容数据
 * @author tangyida <530063113@qq.com>
 */

const response = function ({ code, message, data = null, state }) {
  this.state = state;
  this.code = code;
  this.message = message;
  this.data = data;
}

const createSuccessResponse = ({ code = 0, message = '成功', data = null }) => {
  return new response({
    state: true,
    code,
    message,
    data,
  })
}

const createFailureResponse = ({ code, message = '失败', data = null }) => {
  return new response({
    state: false,
    code,
    message,
    data,
  })
}

module.exports.createInterface = () => {
  return async (ctx, next) => {
    ctx.state.response = {
      success: (code, message, data = null) => {
        const _temp = createSuccessResponse({
          code,
          message,
          data,
        })
        debug_service(_temp);
        ctx.response.body = _temp;
      },
      error: (code, message, data = null) => {
        const _temp = createFailureResponse({
          code,
          message,
          data,
        })
        debug_service(_temp);
        ctx.response.body = _temp;
      }
    }
    await next();
  }
}

module.exports.createSuccessResponse = createSuccessResponse;
module.exports.createFailureResponse = createFailureResponse;

