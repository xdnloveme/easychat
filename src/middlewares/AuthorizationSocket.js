const { singleLoginAuth } = require('@src/service/user/login');
const { ServiceError } = require('@src/utils/errorHandle/');
const { authCode } = require('@src/utils/errorHandle/code');

const handleAuthError = (err) => {
  const ERR_AUTH = new Error('unauthorization');
  if (401 === err.status) {
    debug_service(`权限认证失败:${err}`);
    const originalError = err.originalError;
    if (authCode.hasOwnProperty(originalError.name)) {
      debug_service(`验证失败类型为:${originalError}`);
      ERR_AUTH['data'] = new ServiceError(authCode[originalError.name]);
    }
  } else {
    ERR_AUTH['data'] = err;
  }
  return ERR_AUTH;
}

/**
 * usage: { 连接connect之前的鉴权 socket.use(authSocket()) }
 */
module.exports.authSocket = () => {
  return async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await singleLoginAuth(token);
      socket['decode_payload'] = payload;
      return next();
    } catch (err) {
      console.log('鉴权错误');
      console.log(err);
      return next(handleAuthError(err));
    }
  }
}

/**
 * usage: { 拦截每一个emit的包 socket.use(authPacket(socket, ()=>{})) }
 * socket (io.socket)
 * callback (next, authenticated : Boolean, packet, err ?: Object)
 */
module.exports.authPacket = (socket, callback) => {
  return async (packet, next) => {
    try {
      const token = socket.handshake.query.token;
      console.log('token是', token);
      const payload = await singleLoginAuth(token);
      socket['decode_payload'] = payload;
      callback(packet, next, true);
    } catch (err) {
      console.log(err);
      callback(packet, next, false, handleAuthError(err));
    }
  }
}

module.exports.handleAuthError = handleAuthError;