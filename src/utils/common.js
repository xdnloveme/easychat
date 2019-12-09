/**
 * @file 工具通用模块
 * @author tangyida <530063113@qq.com>
 */

// 判断是否为空（不能含有空格，写空）
const isNull = (str) => {
  if (str.length === 0 || str === null || str === undefined) {
    return true;
  }
  let flag = /\s/.test(str);
  return flag;
}

// 判断是否有特殊字符
const special = (str) => {
  const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
  const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
  return regEn.test(str) || regCn.test(str)
}

// 判断是否是邮箱格式
const isEmail = (str) => {
  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
  return reg.test(str); 
}

const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
};

module.exports = {
  special,
  isNull,
  isEmail,
  getClientIp,
};
