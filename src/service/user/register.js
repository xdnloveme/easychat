/**
 * @file controller层的register业务逻辑
 * @author tangyida <530063113@qq.com>
 */
const User = require('@src/orm/User');

const validation = require('@src/utils/validation')
const { sendMail, ACTIVE_TEMP } = require('@src/utils/mail/mail');
const { createActiveToken, verifyActiveToken } = require('@src/utils/sign/token');
const { createGetUserIdPool, getUpdateUserIdFromPool } = require('@src/service/common');

// 获取用户id
const getUserIdByEmail = async (email) => {
  if (!email) {
    throw new ServiceError(1, '参数必须带有userId或邮箱地址');
  }
  let userInfo = await User.getInfoByEmail(email);
  if (!userInfo) {
    throw new ServiceError(1, '此邮箱还未注册');
  }
  console.log('获取的用户信息是' + JSON.stringify(userInfo));
  return userInfo.userId
}

// 判断用户是否可以注册
const isUserCanActive = async (email) => {
  const userInfo = await User.getInfoByEmail(email);
  console.log(userInfo);
  if (!userInfo) {
    throw new ServiceError(1, '此用户不存在');
  }

  if (userInfo.isActive) {
    throw new ServiceError(1, '此用户已激活，请勿重复激活');
  }
  return userInfo
}

// 通过用户名激活
const activeUserByIdUsername = async (userId, username) => {
  const userInfo = await User.getUserBasicInfoById(userId);
  if (!userInfo) {
    throw new ServiceError(1, '需要激活的用户不存在');
  }

  if (userInfo.isActive) {
    throw new ServiceError(1, '此用户已激活，请勿重复激活');
  }
  let _username = userInfo.username;
  if (username != _username) {
    throw new ServiceError(1, '您的激活码与当前用户对不上');
  }
  await User.active(userInfo.id);

  return {
    status: true,
    message: '激活成功'
  }
}

// 验证激活码是否正确
const veryifyActiveKeyService = async (ctx) => {
  let authorization = ctx.headers['authorization'];
  console.log(authorization);
  const token = authorization.split(' ')[1];
  const payload = verifyActiveToken(token);
  return payload;
}

// 创建激活码
const createActiveKey = async (email) => {
  console.log(email);
  const userInfo = await isUserCanActive(email);

  let username = userInfo.username;
  let userId = userInfo.userId;

  let active_key = createActiveToken({ userId, username, email });
  sendMail(ACTIVE_TEMP(active_key, username), email, '[easychat]-请先激活账号');
  return {
    status: true,
    message: '发送成功',
    data: null 
  }
}

// 注册，添加用户
const insertUser = async ({ username, password, nickname, email, sex = '-1', ip, avatar, signature}) => {
  // 如果用户昵称未定义或者写空，默认格式
  if (!nickname || nickname === null ) {
    nickname = `用户${username.substring(0, 10)}`;
  }
  let validateArr = [ 
    validation.usernameValidate(username), 
    validation.passwordValidate(password),
    validation.nicknameValidate(nickname),
    validation.emailValidate(email)];
    console.log(validateArr);
  for (var i = 0;i < validateArr.length; i++) {
    if (!validateArr[i].state) {
      return {
        status: validateArr[i].state,
        message: validateArr[i].message,
        data: null 
      }
    }
  }

  // 如果用户邮箱已注册则拒绝
  let userInfo = await User.getInfoByEmail(email);
  if (userInfo) {
    throw new ServiceError(1, '此邮箱已被注册');
  }

  const isUserExist = await User.isUserExist(username);

  if (isUserExist) {
    throw new ServiceError(1, '用户名已存在，请换一个更酷炫的用户名吧');
  }
  const pool_message = await createGetUserIdPool();
  debug_service(pool_message);

  const { openId, userId } = await getUpdateUserIdFromPool();
  debug_service('此用户id获取为', openId);
  debug_service('用户真实id', userId);

  const isInsert = await User
  .insertUser({ username, openId, userId, password, nickname, email, sex, ip, avatar, signature });

  if (isInsert) {
    let active_key = createActiveToken({ userId, username, email });
    sendMail(ACTIVE_TEMP(active_key, username), email, '[easychat]-请先激活账号');
  }
  return {
    status: true,
    message: `新用户添加成功，请登录注册邮箱${email}进行激活`,
    data: {
      username,
      userId,
      nickname
    }
  }
}

// 判断用户是否注册
const isUsernameRegister = async (username) => {
  if (!username || typeof username != 'string') {
    throw new Error('用户名必填且是string类型');
  }
  const userInfo = await User.isUserExist(username);
  if (userInfo && userInfo != null) {
    throw new ServiceError(1, '此用户名已被注册', {
      isRegister: true
    });
  }
  return {
    status: false,
    message: '此用户名未注册',
    data: {
      isRegister: false
    }
  }
}

module.exports = {
  createActiveKey,
  insertUser,
  activeUserByIdUsername,
  isUsernameRegister,
  veryifyActiveKeyService,
  getUserIdByEmail
};
