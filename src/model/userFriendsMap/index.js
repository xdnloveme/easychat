/**
 * @file user模型对象orm
 * @author tangyida <530063113@qq.com>
 */

const UserFriendsMap = require('./UserFriendsMapModel');
const structure = require('./structure');
const sequelize = require('@root/config/orm');

UserFriendsMap.init(structure, {
  sequelize,
  modelName: 'user_friends_map',
  freezeTableName: true,
});

module.exports = UserFriendsMap;