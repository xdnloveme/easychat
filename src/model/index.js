/**
 * @file 数据库表model入口出口文件
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */

// 用户表
const User = require('./user')
// 用户-朋友映射表
const UserFriendsMap = require('./userFriendsMap')
// 用户ID池
const UserIdPool = require('./userIdPool')
// 好友请求列表
const FriendRequestMap = require('./friendRequestMap')
// 用户黑名单映射表
const UserBlackListMap = require('./userBlackListMap')
// 用户私聊的最后一条记录
const UserChatRecord = require('./userChatRecord')

UserFriendsMap.hasOne(User, {
  foreignKey: 'openId',
  sourceKey: 'friendOpenId',
  as: 'userInfo',
})

FriendRequestMap.hasOne(User, {
  foreignKey: 'openId',
  sourceKey: 'requestOpenId',
  as: 'userInfo',
})

UserChatRecord.hasOne(User, {
  foreignKey: 'openId',
  sourceKey: 'openId',
  as: 'publicInfo',
})

UserChatRecord.hasOne(User, {
  foreignKey: 'openId',
  sourceKey: 'mapOpenId',
  as: 'mapPublicInfo',
})

module.exports = {
  User,
  UserFriendsMap,
  UserIdPool,
  FriendRequestMap,
  UserBlackListMap,
  UserChatRecord,
}
