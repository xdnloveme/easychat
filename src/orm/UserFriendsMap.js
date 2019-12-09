/**
 * @file 用户好友表的orm操作
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
const { UserFriendsMap, User } = require('../model');

const addFriendsByOpenId = async (openId, requestOpenId) => {
  try {
    const result = await UserFriendsMap.findOrCreate({
      where: {
        openId: requestOpenId,
        friendOpenId: openId,
      }
    });
    return {
      isInsert: result[1],
      insertInfo: result[0],
    }
  } catch (e) {
    throw e;
  }
}

const getContactsFriends = async (openId) => {
  try {
    return await UserFriendsMap.findAll({
      attributes: ['id', 'isBlackList'],
      include: [{
        model: User,
        as: 'userInfo',
        attributes: ['openId', 'nickname', 'sex', 'signature', 'avatar'],
      }],
      where: {
        openId
      }
    });
  } catch (e) {
    throw e;
  }
}

const getFriendship = async (sourceOpenId, targetOpenId) => {
  try {
    return await UserFriendsMap.findOne({
      include: [{
        model: User,
        as: 'userInfo',
        attributes: ['id', 'openId', 'nickname', 'sex', 'signature', 'avatar'],
      }],
      where: {
        openId: sourceOpenId,
        friendOpenId: targetOpenId,
      }
    })
  } catch (e) {
    throw e;
  }
}

module.exports = {
  addFriendsByOpenId,
  getContactsFriends,
  getFriendship
}