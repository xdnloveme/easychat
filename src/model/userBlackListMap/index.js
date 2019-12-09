/**
 * @file user模型对象orm
 * @author tangyida <530063113@qq.com>
 */

const UserBlackListMap = require('./UserBlackListMapModel');
const structure = require('./structure');
const sequelize = require('@root/config/orm');

UserBlackListMap.init(structure, {
  sequelize,
  modelName: 'user_blacklist_map',
  freezeTableName: true,
});

module.exports = UserBlackListMap;