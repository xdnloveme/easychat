/**
 * @file User表映射的结构
 * @author tangyida <530063113@qq.com>
 */
const Sequelize = require('sequelize');

module.exports = {
  id: {
    type: Sequelize.INTEGER(12),
    primaryKey: true,
    autoIncrement: true,
  },
  openId: {
    type: Sequelize.STRING(32),
    allowNull: false,
  },
  requestOpenId: {
    type: Sequelize.STRING(32),
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING(64),
    allowNull: true,
  },
  createdAt: Sequelize.BIGINT,
  isExpired: {
    type: Sequelize.INTEGER(1),
    defaultValue: 0,
  },
  isAgreed: {
    type: Sequelize.INTEGER(1),
    defaultValue: -1,
  },
  isFinish: {
    type: Sequelize.INTEGER(1),
    defaultValue: 0,
  },
  isAddBlackList: {
    type: Sequelize.INTEGER(1),
    defaultValue: 0,
  }
}
