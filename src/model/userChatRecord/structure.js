/**
 * @file User表映射的结构
 * @author tangyida <530063113@qq.com>
 */
const Sequelize = require('sequelize');

module.exports = {
  id: {
    type: Sequelize.INTEGER(32),
    primaryKey: true,
    autoIncrement: true,
  },
  openId: {
    type: Sequelize.STRING(32),
    allowNull: false,
  },
  mapOpenId: {
    type: Sequelize.STRING(32),
    allowNull: false,
  },
  message: {
    type: Sequelize.TEXT(256),
  },
  createdAt: Sequelize.BIGINT,
  sourceOpenId: Sequelize.STRING(32),
}
