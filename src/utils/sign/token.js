/**
 * @file 生成登录的token字符串
 * @author tangyida <530063113@qq.com>
 */
const jwt = require('jsonwebtoken');
const { EXPIRE_SECONDS, EXPIRE_ACTIVE_SECONDS } = require('./expiresTime');

const createToken = ( payload ) => {
  let token = jwt.sign(payload, 'easychat-jwt_api-auth_Tang-Yi-Da', { expiresIn: EXPIRE_SECONDS});
  return token;
}

const createActiveToken = (payload) => {
  return jwt.sign(payload, 'active_key', { expiresIn: EXPIRE_ACTIVE_SECONDS});
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, 'easychat-jwt_api-auth_Tang-Yi-Da');
  } catch (err) {
    Object.assign(err, {
      status: 401,
      originalError: {
        name: err.name,
        message: err.message
      }
    })
    throw err;
  }
}

const verifyActiveToken = (token) => {
  try {
    return jwt.verify(token, 'active_key');
  } catch (err) {
    Object.assign(err, {
      status: 401,
      originalError: {
        name: `Active${err.name}`
      }
    })
    throw err;
  }
}

module.exports = {
  createToken,
  createActiveToken,
  verifyToken,
  verifyActiveToken,
};
