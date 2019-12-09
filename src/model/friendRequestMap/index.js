/**
 * @file user模型对象orm
 * @author tangyida <530063113@qq.com>
 */

const FriendRequestMap = require('./FriendRequestMapModel');
const structure = require('./structure');
const sequelize = require('../../../config/orm');

FriendRequestMap.init(structure, {
  sequelize,
  modelName: 'friend_request_map',
  freezeTableName: true,
  timestamps: true,
  updatedAt: false,
});

module.exports = FriendRequestMap;