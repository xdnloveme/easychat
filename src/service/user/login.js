/**
 * @file controller层的login登录业务逻辑
 * @author tangyida <530063113@qq.com>
 */
const { createToken, verifyToken } = require('@src/utils/sign/token');
const { client } = require('@root/config/redisConfig');
const { isUserExist, getInfoByEmail, getUserPublicInfoById } = require('@src/orm/User');
const { isNull } = require('@src/utils/common');

const { EXPIRE_SECONDS } = require('@src/utils/sign/expiresTime');

const User = require('@src/model/user');

// 通过判断一对一的redis当前用户是否含有持久化token，如果有进行比较，不相等说明之前的token已经失效了
const isRedisHasCurrentUser = async (payload, token) => {
  let userMapToken = await client.getAsync(`easychat:user-${payload.id}`);
  if (!userMapToken) throw new ServiceError(10001);

  // 如果redis存在持久化的token值，则直接删除key值，否则不管，做到user-token唯一对应性
  return userMapToken === token ? true : false;
};

// 验证用户账号密码是否正确
const validateUser = async ({ userInput, password, isEmail }) => {
  let userInfo = [];
  if (isNull(userInput) || isNull(password)) throw new ServiceError(1, '用户名或密码不能为空');
  if (isEmail) {
    userInfo = await getInfoByEmail(userInput);
  } else {
    userInfo = await isUserExist(userInput);
  }
  if (!userInfo) throw new ServiceError(2, '此邮箱(用户名)还未注册');

  debug_service(`获取的用户信息是:\n ${JSON.stringify(userInfo, null, 4)}`);
  if (password !== userInfo.password) {
    throw new ServiceError(1, '用户名或密码错误,请重试');
  }

  if (userInfo.isActive != 1) {
    throw new ServiceError(1, '此用户还未激活，请先激活');
  }

  const user_instance = User.build(userInfo.dataValues);

  return {
    isPass: true,
    id: userInfo.id,
    publicInfo: user_instance.getPublicInfo(),
  };
};

// 对登录的用户进行jwt验证
const loginSign = async ({ username, id, publicInfo }) => {
  const timestamp = new Date().getTime();
  let token = createToken({ username, id, timestamp, publicInfo });
  await client.setAsync(`easychat:user-${id}`, token, 'EX', EXPIRE_SECONDS);
  return token;
};

// 删除用户的token失效
const deleteSign = async ctx => {
  const token = ctx.request.headers['authorization'].split(' ')[1];
  let payload = verifyToken(token);
  if (await isRedisHasCurrentUser(payload, token)) {
    // 如果redis存在token值，则直接删除key值，否则不管，做到user-token唯一对应性
    await client.delAsync(`easychat:user-${payload.id}`);
  } else {
    throw new ServiceError(10009);
  }
  return true;
};

// 单点登录验证（利用redis持久化），返回值为解密后的payload信息
const singleLoginAuth = async token => {
  const prefixKey = 'Bearer ';
  if (!token) {
    throw new ServiceError(10005); // 缺少权限头
  }

  if (token.indexOf(prefixKey) === -1) {
    token = prefixKey + token;
  }

  let jwt_token = token.split(prefixKey)[1];
  // jwt验证
  const payload = verifyToken(jwt_token);
  if (!(await isRedisHasCurrentUser(payload, jwt_token))) {
    throw new ServiceError(10009);
  }

  return payload;
};

// 根据用户的token获取payload
const getUserInfoByToken = async ctx => {
  // 单点登录验证
  const token = ctx.request.header['authorization'];
  const payload = await singleLoginAuth(token);
  debug_service('验证用户token成功：%o', payload);
  const publicInfo = await getUserPublicInfoById(payload.id);
  debug_service('获取用户公开信息：%o', publicInfo);
  return {
    publicInfo,
  };
};

module.exports = {
  validateUser,
  loginSign,
  deleteSign,
  singleLoginAuth,
  getUserInfoByToken,
};
