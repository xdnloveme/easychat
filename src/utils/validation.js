/**
 * @file 表单验证模块（用户名，密码等规则）
 * @author tangyida <530063113@qq.com>
 */

const common = require('./common');

const usernameValidate = (username) => {
  const message = '用户名不能为空、含有特殊字符，长度不能超过16'
  if (!username) {
    return {
      message,
      state: false
    };
  }
  if (common.isNull(username) || common.special(username) || username.length > 16) {
    return {
      message,
      state: false
    };
  }
  return { message: '通过验证', state: true };
}

const passwordValidate = (password) => {
  const message = '密码长度不能超过30';
  if (password.length > 30) {
    return { message, state: false };
  }
  return { message: '通过验证', state: true };
}

const nicknameValidate = (nickname) => {
  const message = '昵称长度不能超过12'
  if (nickname && nickname.length > 12) {
    return { message, state: false };
  }
  return { message: '通过验证', state: true };
}

const emailValidate = (email) => {
  const message = '请输入正确的邮箱格式xx@xx.com'
  let flag = common.isEmail(email);
  return {
    message: flag ? '通过验证' : message,
    state: flag
  }
}

module.exports = {
  usernameValidate,
  passwordValidate,
  nicknameValidate,
  emailValidate
};
