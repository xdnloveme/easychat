/**
 * @file 通用服务模块
 * @author tangyida <530063113@qq.com>
 */
const User = require('../orm/User');
const USERID_POOL_GROUP_AMOUNT = 5;


/**
 * 获取用户号码池的数据（一次性500个）
 * @param {号码池的基数} base 
 */
const createUserIdPoolBulkData = (base) => {
  let bulkData = [];
  for (let i = base; i < (base + USERID_POOL_GROUP_AMOUNT); i++) {
    bulkData.push({
      userId: i,
      isLocked: 0,
    })
  }
  // 简单随机打乱
  bulkData.sort(() => Math.random() > 0.5 ? -1 : 1);
  return bulkData;
}

// 创建号码池。如果不存在就从零创建，存在就判断号码池是否被填满
const createGetUserIdPool = async () => {
  const count = await User.getUserIdPoolCount();
  if (count === 0) {
    const user_count = await User.getUserCount();

    const bulkData = createUserIdPoolBulkData(user_count);
    await User.createUserIdPool(bulkData);
    return '号码池不存在，添加成功'
  } else {
    const lastUnlockedUserId = await User.getLastUnlockedUserId();
    if (!lastUnlockedUserId) {
      const max_userId = await User.getMaxUserId();
      const bulkData_2 = createUserIdPoolBulkData((max_userId + 1));
      await User.clearCreateUserIdPool(bulkData_2);
      return '添加号码池成功'
    }
    return '号码池已存在'
  }
}

const getUpdateUserIdFromPool = async () => {
  const updateColumn = await User.getLastUnlockedUserId();
  let userId = updateColumn.userId;
  debug_service('获取的id是: ', userId);
  const _FIRST = parseInt(userId / USERID_POOL_GROUP_AMOUNT);
  // 距离2019-07-15号创建项目的时间戳
  const _TimeToCreateProject = parseInt((new Date().getTime() - new Date('2019-7-15').getTime()) / 1000 / 3600);
  // 截取不小于4位的id
  userId.toString().length < 4 ? userId = ('0000' + userId).slice(-4) : userId = userId.toString();

  return {
    openId: `${_FIRST}${_TimeToCreateProject}${userId}`,
    userId: updateColumn.userId,
  }
}

module.exports = {
  createGetUserIdPool,
  getUpdateUserIdFromPool
};
