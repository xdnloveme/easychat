/**
 * @file 用户黑名单表orm操作
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
const { UserBlackListMap, FriendRequestMap } = require('../model');
const sequelize = require('../../config/orm');

// 加入黑名单
const handleAddBlackListRequest = async ({ openId, requestOpenId }) => {
  try {
    return await sequelize.transaction(async t => {
      const createResult = await UserBlackListMap.findOrCreate({
        where: {
          openId,
          blackOpenId: requestOpenId,
        },
        transaction: t,
      });

      if (!createResult[1]) {
        throw {
          isCommit: false,
          step: 1,
        };
      }

      const updateResult = await FriendRequestMap.update(
        {
          isAddBlackList: 1,
        },
        {
          where: {
            openId,
            requestOpenId,
          },
          transaction: t,
        },
      );

      if (updateResult[0] === 0) {
        throw {
          isCommit: false,
          step: 2,
        };
      }

      return {
        isCommit: true,
        step: 2,
      };
    });
  } catch (e) {
    return e;
  }
};

const handleRemoveFromBlackListOrm = async ({ openId, requestOpenId }) => {
  try {
    return await sequelize.transaction(async t => {
      const res = await UserBlackListMap.destroy({
        where: {
          openId,
          blackOpenId: requestOpenId,
        },
        transaction: t,
      });

      if (res[0] === 0) {
        throw {
          isCommit: false,
          step: 1,
        };
      }

      const updateResult = await FriendRequestMap.update(
        {
          isAddBlackList: 0,
        },
        {
          where: {
            openId,
            requestOpenId,
          },
          transaction: t,
        },
      );

      if (updateResult[0] === 0) {
        throw {
          isCommit: false,
          step: 2,
        };
      }

      return {
        isCommit: true,
        step: 2,
      };
    });
  } catch (e) {
    return e;
  }
};

module.exports = {
  handleAddBlackListRequest,
  handleRemoveFromBlackListOrm,
};
