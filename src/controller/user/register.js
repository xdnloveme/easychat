/**
 * @file 注册的controller层
 * @author tangyida <530063113@qq.com>
 */
const register = require('@src/service/user/register');
const { getClientIp } = require('@src/utils/common');

/**
 * [insertNewUser 注册添加新用户]
 * @param {Object} ctx
 * @return {Promise}
 */
const insertNewUser = async ctx => {
  const postdata = ctx.request.body;
  const username = postdata.username;
  const password = postdata.password;
  const nickname = postdata.nickname || '测试昵称';
  const email = postdata.email;
  const sex = postdata.sex;
  const ip = getClientIp(ctx.req);
  const avatar = '/headIcon.jpeg';
  const signature = '这个人很懒，什么都不想说';
  const registerData = await register.insertUser({
    username,
    password,
    nickname,
    email,
    sex,
    ip,
    avatar,
    signature,
  });
  console.log(registerData);
  ctx.state.response.success(registerData.status ? 0 : 1, registerData.message);
};

/**
 * [insertNewUser 激活新用户]
 * @param {Object} ctx
 * @return {Promise}
 */
const activeUser = async ctx => {
  await ctx.render('index');
};

const veryifyActiveKey = async ctx => {
  const payload = await register.veryifyActiveKeyService(ctx);
  const { status, message } = await register.activeUserByIdUsername(payload.userId, payload.username);
  if (status) {
    ctx.state.response.success(0, message);
  }
};

const createActiveKey = async ctx => {
  try {
    let userId = ctx.request.query.userId;
    console.log('获取的userId是' + userId);
    const result = await register.createActiveKey(userId);
    ctx.body = result.message;
  } catch (e) {
    console.log(e);
    ctx.body = '发送失败';
  }
};

const createActiveKeyRestful = async ctx => {
  const email = ctx.request.query.email;
  // let userId = await register.getUserIdByEmail(email);
  const result = await register.createActiveKey(email);
  ctx.state.response.success(result.status ? 0 : 1, result.message);
};

const isUsernameRegister = async ctx => {
  const username = ctx.request.query.username;
  const result = await register.isUsernameRegister(username);
  ctx.state.response.success(0, result.message, result.data);
};

module.exports = {
  insertNewUser,
  activeUser,
  veryifyActiveKey,
  createActiveKey,
  createActiveKeyRestful,
  isUsernameRegister,
};
