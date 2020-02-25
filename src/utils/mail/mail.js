/**
 *
 * @Description 邮件发送
 * 调用方法:sendMail('530063113@qq.com','这是测试邮件', 'Hi Leon,这是一封测试邮件');
 * @Author THY
 *
 */

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config');
var template = require('./template');

// 建立邮件服务器实例
smtpTransport = nodemailer.createTransport(
  smtpTransport({
    service: config.email.service,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  }),
);

// 激活邮件的html模板
const ACTIVE_TEMP = function(active_key, email) {
  return template.html(active_key, email);
};

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
const sendMail = function(html, recipient, subject, callback) {
  smtpTransport.sendMail(
    {
      from: config.email.user,
      to: recipient,
      subject: subject,
      html: html,
    },
    function(error, response) {
      if (error) {
        console.log('发送邮件出错');
        console.log(error);
        // throw error;
        return callback(false);
      }
      console.log('发送成功', response);
      console.log('发送的地址是', recipient);
      return callback(response);
    },
  );
};

module.exports = {
  sendMail,
  ACTIVE_TEMP,
};
