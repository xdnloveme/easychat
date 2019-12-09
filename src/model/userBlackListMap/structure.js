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
  openId: {
    type: Sequelize.STRING(32),
    allowNull: false,
  },
  blackOpenId: {
    type: Sequelize.STRING(32),
    allowNull: false,
  },
}
