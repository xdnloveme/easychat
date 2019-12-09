/**
 * @file controller层的register业务逻辑
 * @author tangyida <530063113@qq.com>
 */
const User = require('@src/orm/User');
const UserFriendsMap = require('@src/orm/UserFriendsMap');

// 根据用户openId进行搜索
const searchByOpenId = async openId => {
  return await User.getUserPublicInfoByOpenId(openId);
};

// 获取个人的推荐好友（这里因为篇幅精力有限，只做了一个随机取用户表数据的操作，想实现推荐算法的另外实现）
const getRecommendUserService = async openId => {
  debug_service('openId: ', openId);
  return await User.getRandomUser();
};

const addFriendsByOpenIdService = async ({ openId, requestOpenId }) => {
  debug_service('用户ID' + openId + ' 请求用户的ID' + requestOpenId);
  if (!openId || !requestOpenId) {
    throw new ServiceError(1, '用户id和请求id不能为空');
  }

  if (openId === requestOpenId) {
    throw new ServiceError(1, '不能添加自己为好友');
  }

  const { isInsert } = await UserFriendsMap.addFriendsByOpenId(openId, requestOpenId);
  if (!isInsert) {
    throw new ServiceError(1, '你们已经是好友了');
  }

  return true;
};

const getContactsListService = async openId => {
  if (!openId) {
    throw new ServiceError(1, '简聊号不能为空');
  }

  return await UserFriendsMap.getContactsFriends(openId);
};

const isFriendsByOpenId = async (sourceOpenId, targetOpenId) => {
  if (!sourceOpenId || !targetOpenId) {
    throw new ServiceError(1, '简聊号不能为空');
  }

  return await UserFriendsMap.getFriendship(sourceOpenId, targetOpenId);
};

const getUserInfoByOpenId = async openId => {
  return await User.getUserInfoByOpenId(openId);
};

const modifyPublicInfoService = async (publicInfo, id) => {
  // 可以被修改的只有：头像，昵称，性别，签名，地区
  const { avatar, nickname, sex, signature, district } = publicInfo;
  if (
    avatar === undefined ||
    nickname === undefined ||
    sex === undefined ||
    signature === undefined ||
    district === undefined
  ) {
    throw new ServiceError(1, '任意的公开信息的修改，其属性内容不可或缺或更改');
  }

  const isNickNameExist = await User.isNickNameExist(nickname, id);

  if (isNickNameExist) {
    throw new ServiceError(1, '此昵称已被占用，请更换一个试试 : )');
  }

  return await User.updatePublicInfo(
    {
      avatar,
      nickname,
      sex,
      signature,
      district,
    },
    id,
  );
};

module.exports = {
  searchByOpenId,
  getRecommendUserService,
  addFriendsByOpenIdService,
  getContactsListService,
  isFriendsByOpenId,
  getUserInfoByOpenId,
  modifyPublicInfoService,
};
