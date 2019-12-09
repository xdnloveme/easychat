/**
 * @file 数据库orm交互层，数据库用户（user）表类相关操作
 * @author tangyida <530063113@qq.com>
 */

const { UserIdPool, User } = require('../model');
const sequelize = require('../../config/orm');
const { Op } = require('sequelize')

/**
 * [active 激活用户]
 * @return {Promise}
 */
const active = async id => {
  try {
    return await User.update(
      {
        isActive: 1,
      },
      {
        where: {
          id: id,
        },
      },
    );
  } catch (e) {
    throw e;
  }
};

/**
 * [getUserDetail 获取用户详细信息]
 * @return {Promise}
 */
const getUserBasicInfoById = async userId => {
  try {
    let data = await User.findOne({
      where: {
        userId: userId,
      },
    });
    return data;
  } catch (e) {
    throw e;
  }
};

/**
 * [isUserExist 判断用户名是否存在]
 * @return {Promise} 返回数据数组，大于0说明存在
 */
const isUserExist = async username => {
  try {
    const userInfo = await User.findOne({
      where: {
        username: username,
      },
    });
    return userInfo;
  } catch (e) {
    throw e;
  }
};

// 判断昵称是否被占用
// 传入的id是用户id，表示排除本身
const isNickNameExist = async (nickname, id = null) => {
  try {
    let params = {
      nickname,
    }
    if (id !== null) {
      params = {
        ...params,
        id: {
          [Op.ne]: id,
        },
      }
    }
    const userInfo = await User.findOne({
      where: params,
    });
    console.log('修改结果', userInfo);
    return userInfo ? true : false;
  } catch (e) {
    throw e;
  }
};

/**
 * [insertUser 添加新用户]
 * @return {Promise} 返回数据数组，有insertId说明添加成功
 */
const insertUser = async ({ username, openId, userId, password, nickname, email, sex, ip, avatar, signature }) => {
  try {
    return sequelize.transaction(t => {
      return User.create(
        {
          username: username,
          openId: openId,
          userId: userId,
          password: password,
          nickname: nickname,
          email: email,
          sex: sex,
          ip: ip,
          avatar: avatar,
          signature: signature,
        },
        {
          transaction: t,
          lock: true,
        },
      ).then(insertUser => {
        debug_service('插入的条目', JSON.stringify(insertUser, null, 4));
        return UserIdPool.update(
          {
            isLocked: 1,
          },
          {
            where: {
              isLocked: 0,
              userId: userId,
            },
            limit: 1,
            lock: true,
            transaction: t,
          },
        ).then(updateResult => {
          if (updateResult[0] === 0) {
            throw new ServiceError(1, '注册时发生未知错误，请重试');
          }
          return true;
        });
      });
    });
  } catch (e) {
    throw e;
  }
};

// 根据邮箱获取信息
const getInfoByEmail = async email => {
  try {
    const userInfo = await User.findOne({
      where: {
        email: email,
      },
    });
    return userInfo;
  } catch (e) {
    throw e;
  }
};

// 根据用户唯一ID获取公开信息
const getUserPublicInfoById = async id => {
  try {
    const userInfo = await User.findOne({
      where: {
        id: id,
      },
    });
    const instance = User.build(userInfo.dataValues);

    return instance.getPublicInfo();
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// 获取User表用户数量
const getUserCount = async () => {
  try {
    const count = await User.count();
    return count;
  } catch (e) {
    throw e;
  }
};

// 获取用户ID池的个体数量
const getUserIdPoolCount = async () => {
  try {
    const count = await UserIdPool.count();
    return count;
  } catch (e) {
    throw e;
  }
};

// 创建用户ID池
const createUserIdPool = async bulkData => {
  try {
    return sequelize.transaction(t => {
      return UserIdPool.bulkCreate(bulkData, {
        transaction: t,
      });
    });
  } catch (e) {
    throw e;
  }
};

// 获取最新的未锁住的用户ID
const getLastUnlockedUserId = async () => {
  try {
    const userId = await UserIdPool.findOne({
      where: {
        isLocked: 0,
      },
    });
    return userId;
  } catch (e) {
    throw e;
  }
};

// 清除当前的用户ID池
const clearCreateUserIdPool = async bulkData => {
  try {
    return sequelize.transaction(t => {
      return UserIdPool.destroy({
        where: {},
        transaction: t,
      }).then(() => {
        return UserIdPool.bulkCreate(bulkData, {
          transaction: t,
        });
      });
    });
  } catch (e) {
    throw e;
  }
};

// 获取用户当前最大的ID
const getMaxUserId = async () => {
  try {
    return await UserIdPool.max('userId');
  } catch (e) {
    throw e;
  }
};

// 通过用户的公开ID获取用户的公开信息
const getUserPublicInfoByOpenId = async openId => {
  try {
    const userInfo = await User.findAll({
      where: {
        openId: openId,
      },
    });
    return userInfo.map(item => {
      return User.build(item.dataValues).getPublicInfo();
    });
  } catch (e) {
    throw e;
  }
};

// 通过用户公开ID获取用户信息
const getUserInfoByOpenId = async openId => {
  try {
    return await User.findOne({
      where: {
        openId: openId,
      },
    });
  } catch (e) {
    throw e;
  }
};

// 随机获取5名用户（简单的推荐用户，可自己扩展）
const getRandomUser = async () => {
  try {
    const userInfo = await User.findAll({
      limit: 5,
      order: sequelize.random(),
    });
    return userInfo.map(item => {
      return User.build(item.dataValues).getPublicInfo();
    });
  } catch (e) {
    throw e;
  }
};

// 更新用户公开信息
const updatePublicInfo = async (modifyPublicInfo, id) => {
  try {
    return sequelize.transaction(t => {
      return User.update(
        {
          ...modifyPublicInfo,
        },
        {
          where: {
            id: id,
          },
          transaction: t,
        },
      ).then(async () => {
        const userInfo = await User.findOne({
          where: {
            id,
          },
          transaction: t,
        });
        const instance = User.build(userInfo.dataValues);

        return instance.getPublicInfo();
      });
    });
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getUserBasicInfoById,
  isNickNameExist,
  isUserExist,
  insertUser,
  active,
  getInfoByEmail,
  getUserPublicInfoById,
  getUserCount,
  createUserIdPool,
  getUserIdPoolCount,
  getLastUnlockedUserId,
  clearCreateUserIdPool,
  getMaxUserId,
  getUserPublicInfoByOpenId,
  getUserInfoByOpenId,
  getRandomUser,
  updatePublicInfo,
};
