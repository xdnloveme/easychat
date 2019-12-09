/**
 * @file 用户方法汇总的controller层
 * @author tangyida <530063113@qq.com>
 */
const user = require('@src/service/user/user');

const searchByOpenId = async ctx => {
  const { openId } = ctx.request.query;
  debug_service('搜索openId: ', openId);
  const userPublicInfo = await user.searchByOpenId(openId);
  ctx.state.response.success(0, '查询成功', userPublicInfo);
};

const getRecommendUser = async ctx => {
  const recommendUsers = await user.getRecommendUserService('测试openId');
  ctx.state.response.success(0, '查询成功', recommendUsers);
};

// const addFriendsByOpenId = async (ctx) => {
//     const { openId, requestOpenId } = ctx.request.body;
//     const addFlag = await user.addFriendsByOpenIdService({ openId, requestOpenId });
//     ctx.state.response.success(0, '添加好友成功', { isSuccess: addFlag });
// }

const getContactsList = async ctx => {
  const openId = ctx.request.query.openId;
  const contactsList = await user.getContactsListService(openId);
  ctx.state.response.success(0, '查询成功', { contactsList });
};

const modifyPublicInfo = async ctx => {
  const { publicInfo } = ctx.request.body;
  const payload = ctx.request['decode_payload'];
  const { id } = payload;
  const modifyResult = await user.modifyPublicInfoService(publicInfo, id);
  ctx.state.response.success(0, '修改成功', { publicInfo: modifyResult});
};

module.exports = {
  searchByOpenId,
  getRecommendUser,
  // addFriendsByOpenId,
  getContactsList,
  modifyPublicInfo,
};
