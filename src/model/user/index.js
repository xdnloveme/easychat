/**
 * @file user模型对象orm
 * @author tangyida <530063113@qq.com>
 */

const User = require('./UserModel');
const structure = require('./structure');
const sequelize = require('../../../config/orm');

User.init(structure, {
  sequelize,
  modelName: 'user',
  freezeTableName: true,
});

module.exports = User;