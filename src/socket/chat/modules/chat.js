/**
 * @file socket通讯，广场模块实现
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
const namespace = require('../namespace');
const { client } = require('@root/config/redisConfig');
const {
  isFriendsByOpenId,
  getUserInfoByOpenId,
  searchByOpenId,
  getContactsListService,
} = require('@src/service/user/user');
const {
  getLatestRequest,
  addFriendRequest,
  getRequestListByOpenId,
  handleAgreedFriendRequest,
  deleteFriendRequest,
} = require('@src/orm/FriendRequest');
const { handleAddBlackListRequest, handleRemoveFromBlackListOrm } = require('@src/orm/UserBlackListMap');
const { addLastChatRecord, getChatRecord } = require('@src/orm/UserChatRecord');
const { getFriendship } = require('@src/orm/UserFriendsMap');
const { createSuccessResponse, createFailureResponse } = require('@src/utils/responseContent');

const STORE_NAME = 'EASYCHAT-ONLINE-STORE';

/**
 * 移除redis中hash表的在线用户
 * @param {object} socket socket对象
 * @param {string} userId 用户id（非openId）
 */
const removeOnlineUser = async (socket, userId) => {
  await client.hdelAsync(STORE_NAME, userId);
};

// 和clients同步在线用户hash表
const syncOnlineStore = socket => {
  namespace.clients(async (error, clients) => {
    if (error) throw error;
    const onlineData = await client.hgetallAsync(STORE_NAME);
    Object.keys(onlineData).forEach(async _key => {
      if (!clients.find(item => item === onlineData[_key])) {
        await removeOnlineUser(socket, _key);
      }
    });
  });
};

// 整合好友请求
const filterRequestList = list => {
  const keys = [];
  const filterList = [];
  list.forEach(item => {
    const requestInfo = item.userInfo;
    const requestId = requestInfo.openId;
    const isExist = keys.some(key => key === requestId);
    if (isExist) {
      let current = filterList.find(item => item.userInfo.openId === requestId);
      if (current) {
        let message = current.message;
        if (typeof message === 'string') {
          message = [message];
        }
        current = Object.assign(current, item, {
          message: message.concat(item.message),
        });
      }
    } else {
      keys.push(requestId);
      filterList.push(item);
    }
  });
  return filterList;
};

/**
 * 向redis在线hash表中添加用户
 * @param {object} socket socket对象
 * @param {string} userId 用户id（非openId）
 */
const addOnlineUser = async (socket, userId) => {
  const isExistsSocketId = await client.hgetAsync(STORE_NAME, userId);
  if (isExistsSocketId) {
    // 如果此账号还在线，则发送给另外一个socketId，这代表他被顶号了
    namespace.to(isExistsSocketId).emit('squeezed-out', '你的号已在其他地方上线！');
  }

  await client.hsetAsync(STORE_NAME, userId, socket.id);
  await syncOnlineStore(socket, userId);
};

/**
 * 根据用户id返回在线socketId，可以判断是否在线
 * @param {string} targetId 用户id
 * @return {string} socket.id 返回socketId值
 */
const isOnline = async targetId => {
  return await client.hgetAsync(STORE_NAME, targetId);
};

const emitRequestListByOpenId = async (socket, openId) => {
  const friendRequestList = await getRequestListByOpenId(openId);
  socket.emit('friendRequestList-received', filterRequestList(friendRequestList));
  return friendRequestList;
};

// 发送私密消息事件
module.exports.privateMessage = socket => {
  return async (payload, callback) => {
    const { sourceOpenId, targetOpenId } = payload;
    if (sourceOpenId === targetOpenId) {
      return socket.emit('error', new ServiceError(1, '无法向自己发送信息'));
    }

    const isFriend = await isFriendsByOpenId(sourceOpenId, targetOpenId);
    if (!isFriend) {
      socket.emit('error', new ServiceError(1, '你们还不是朋友，无法私聊'));
      return;
    }

    const targetId = isFriend.userInfo['id'];
    const targetSocketId = await isOnline(targetId);
    if (!targetSocketId) {
      console.log('不在线');
      // ...
      // 这里准备做留言功能
      // socket.emit('error', new ServiceError(1, '对方不在线，发送失败，暂不支持留言。'));
      callback(false, '对方不在线，此为测试版本，暂不支持离线留言');
    } else {
      // 私聊发给对方和自己
      callback(true, '发送到服务器成功');
      // 没有存储聊天记录，只存储最后一条消息
      await addLastChatRecord({
        openId: sourceOpenId,
        mapOpenId: targetOpenId,
        message: payload.message,
        createdAt: payload.timestamp,
      });
      namespace
        .to(targetSocketId)
        .to(socket.id)
        .emit('privateMessage-received', payload);
    }
  };
};

// 添加新的在线用户方法
module.exports.addChatUser = async socket => {
  const { id } = socket.decode_payload;
  debug_service('解析token=', socket.decode_payload);
  await addOnlineUser(socket, id);
};

// 移除在线用户
module.exports.removeChatUser = async socket => {
  const { id } = socket.decode_payload;
  debug_service('解析token=', socket.decode_payload);
  // 移除在线（直接异步执行，不管返回）
  await removeOnlineUser(socket, id);
};

module.exports.init = async socket => {
  const { publicInfo } = socket.decode_payload;
  const { openId } = publicInfo;
  await emitRequestListByOpenId(socket, openId);
  const result = await getChatRecord(openId);
  namespace.to(socket.id).emit('privateMessage-init', result);
};

// 发出好友请求，等待对方回应
module.exports.addFriendRequest = socket => {
  return async ({ openId, requestOpenId, message }, callback) => {
    if (openId === requestOpenId) {
      socket.emit('error', new ServiceError(1, '不能添加自己为好友'));
      return callback(false);
    }

    const isFriend = await getFriendship(requestOpenId, openId);

    if (isFriend) {
      socket.emit('error', new ServiceError(1, '您已经是对方的好友了'));
      return callback(false);
    }

    let requestInfo = await addFriendRequest({ openId, requestOpenId, message });

    requestInfo = filterRequestList(requestInfo);

    const userInfo = await getUserInfoByOpenId(openId);
    const requestUserPublicInfo = await searchByOpenId(requestOpenId);
    const targetId = userInfo.id;

    const targetSocketId = await isOnline(targetId);
    if (targetSocketId) {
      namespace.to(targetSocketId).emit('addFriendRequest-received', {
        message,
        publicInfo: requestUserPublicInfo,
        requestInfo,
      });
    }
    callback(true);
  };
};

// 处理对方好友请求
module.exports.handleFriendRequest = socket => {
  return async ({ isAgreed, requestOption }, callback) => {
    const { openId, requestOpenId } = requestOption;
    const requestData = await getLatestRequest(openId, requestOpenId);
    if (!requestData) {
      return socket.emit('error', new ServiceError(1, '无此用户请求'));
    }

    // 如果在黑名单中
    if (requestData.isAddBlackList === 1) {
      return socket.emit('error', new ServiceError(1, '对方在你的黑名单中，请先移除再添加'));
    }

    // 如果请求已经完成
    if (requestData.isFinish === 1) {
      let message = '当前请求已失效，请主动添加对方好友';

      if (requestData.isExpired === 1) {
        message = '好友请求已过期，请主动添加对方好友';
      }
      return callback(
        createFailureResponse({
          message,
        }),
      );
    }

    if (isAgreed) {
      const { isCommit, step } = await handleAgreedFriendRequest(requestOption);
      // 事务是否成功提交
      if (isCommit) {
        const contactsList = await getContactsListService(openId);
        const friendRequestList = await emitRequestListByOpenId(socket, openId);
        const requestList = friendRequestList.find(item => item.openId === openId);
        return callback(
          createSuccessResponse({
            message: '成功添加好友',
            data: {
              requestList,
              contactsList,
            },
          }),
        );
      } else {
        return socket.emit('error', new ServiceError(1, '添加好友失败'));
      }
    }

    return callback(
      createFailureResponse({
        message: '添加好友请求未同意',
      }),
    );
  };
};

module.exports.handleAddBlackListRequest = socket => {
  return async (requestOption, callback) => {
    const { openId } = requestOption;

    // 进行了拉黑操作
    const { isCommit, step } = await handleAddBlackListRequest(requestOption);
    if (isCommit) {
      const friendList = await emitRequestListByOpenId(socket, openId);
      const data = friendList.find(item => item.openId === openId);
      return callback(
        createSuccessResponse({
          message: '添加到黑名单成功，你将收不到对方任何消息',
          data,
        }),
      );
    } else {
      if (step === 1) {
        return socket.emit('error', new ServiceError(1, '对方已经被你拉黑了'));
      }
      return socket.emit('error', new ServiceError(1, '拉黑失败'));
    }
  };
};

module.exports.handleRemoveFromBlackList = socket => {
  return async (requestOption, callback) => {
    const { openId, requestOpenId } = requestOption;
    const { isCommit } = await handleRemoveFromBlackListOrm({
      openId,
      requestOpenId,
    });
    if (isCommit) {
      const friendList = await emitRequestListByOpenId(socket, openId);
      const data = friendList.find(item => item.openId === openId);
      return callback(
        createSuccessResponse({
          message: '移除黑名单成功',
          data,
        }),
      );
    } else {
      return socket.emit('error', new ServiceError(1, '移除黑名单失败'));
    }
  };
};

module.exports.deleteFriendRequest = socket => {
  return async (requestOption, callback) => {
    const { openId, requestOpenId } = requestOption;
    const isFriend = await getFriendship(requestOpenId, openId);

    if (!isFriend) {
      socket.emit('error', new ServiceError(1, '对方不是您的好友，无法删除'));
      return callback(false);
    }

    const data = await deleteFriendRequest(openId, requestOpenId);

    return callback(
      createSuccessResponse({
        message: '删除成功',
        data,
      }),
    );
  };
};
