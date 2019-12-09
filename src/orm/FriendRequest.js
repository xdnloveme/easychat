/**
 * @file 好友请求相关的orm操作
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
const Sequelize = require('sequelize');
const { FriendRequestMap, User, UserFriendsMap } = require('../model');
const { getContactsFriends } = require('./UserFriendsMap');
const sequelize = require('../../config/orm');

const deleteFriendRequest = async (openId, requestOpenId) => {
  return sequelize.transaction(t => {
    return FriendRequestMap.destroy({
      where: {
        openId,
        requestOpenId,
      },
      transaction: t,
    }).then(() => {
      return UserFriendsMap.destroy({
        where: {
          openId: requestOpenId,
          friendOpenId: openId,
        },
      }).then(() => {
        return getContactsFriends(openId);
      });
    });
  });
};

const getLatestRequest = async (openId, requestOpenId) => {
  return sequelize.transaction(t => {
    return FriendRequestMap.max('createdAt', {
      where: {
        openId,
        requestOpenId,
      },
      transaction: t,
    }).then(maxValue => {
      return FriendRequestMap.findOne({
        where: {
          openId,
          requestOpenId,
          createdAt: maxValue,
        },
        transaction: t,
      });
    });
  });
};

const addFriendRequest = async ({ openId, requestOpenId, message }) => {
  const timestamps = new Date().getTime();
  return sequelize.transaction(t => {
    return FriendRequestMap.create(
      {
        openId,
        requestOpenId,
        message,
        createdAt: timestamps,
      },
      {
        transaction: t,
      },
    ).then(() => {
      return FriendRequestMap.findAll({
        attributes: [
          'openId',
          'requestOpenId',
          'message',
          'createdAt',
          'isExpired',
          'isAgreed',
          'isFinish',
          'isAddBlackList',
        ],
        include: [
          {
            model: User,
            as: 'userInfo',
            attributes: ['openId', 'nickname', 'sex', 'signature', 'avatar'],
          },
        ],
        where: {
          openId,
          requestOpenId,
        },
        transaction: t,
      })
    });
  });
};

// 获取openId所在所有请求
const getRequestListByOpenId = async openId => {
  return await FriendRequestMap.findAll({
    attributes: [
      'openId',
      'requestOpenId',
      'message',
      'createdAt',
      'isExpired',
      'isAgreed',
      'isFinish',
      'isAddBlackList',
    ],
    include: [
      {
        model: User,
        as: 'userInfo',
        attributes: ['openId', 'nickname', 'sex', 'signature', 'avatar'],
      },
    ],
    where: {
      openId,
    },
  });
};

const handleAgreedFriendRequest = async ({ openId, requestOpenId }) => {
  try {
    return await sequelize.transaction(async t => {
      await UserFriendsMap.findOrCreate({
        where: {
          openId: requestOpenId,
          friendOpenId: openId,
        },
        transaction: t,
      });

      await UserFriendsMap.findOrCreate({
        where: {
          openId: openId,
          friendOpenId: requestOpenId,
        },
        transaction: t,
      });

      await FriendRequestMap.update(
        {
          isAgreed: 1,
          isFinish: 1,
        },
        {
          where: {
            openId,
            requestOpenId,
          },
          transaction: t,
        },
      );

      return {
        isCommit: true,
        step: 3,
      };
    });
  } catch (err) {
    return err;
  }
};

module.exports = {
  getLatestRequest,
  addFriendRequest,
  getRequestListByOpenId,
  handleAgreedFriendRequest,
  deleteFriendRequest,
};
