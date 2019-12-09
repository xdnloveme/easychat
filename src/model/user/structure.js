/**
 * @file User表映射的结构
 * @author tangyida <530063113@qq.com>
 */
const Sequelize = require('sequelize');

module.exports = {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  district: {
    type: Sequelize.STRING(32),
    defaultValue: '未知',
  },
  openId: Sequelize.STRING,
  userId: Sequelize.STRING,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  nickname: Sequelize.STRING,
  email: Sequelize.STRING,
  ip: Sequelize.STRING,
  avatar: Sequelize.STRING(128),
  sex: Sequelize.INTEGER(1),
  isActive: Sequelize.INTEGER(1),
  signature: Sequelize.STRING(30),
};
