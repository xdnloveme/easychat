/**
 * @file socket通讯，广场模块实现
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
const AuthorizationSocket = require('@src/middlewares/AuthorizationSocket');
const square = require('./modules/square');
const chat = require('./modules/chat');

module.exports.connection = async (socket) => {
  debug_service('有人上线!', socket.id);

  socket.use(AuthorizationSocket.authPacket(socket, (packet, next, authenticated, err) => {
    debug_service('中间件-每个发送包都被检查：', packet);
    if (!authenticated) {
      square.kickMembers({ socket });
      return next(err)
    }
    return next();
  }));

  // 添加在线用户
  await chat.addChatUser(socket);
  // 初始化 /chat
  await chat.init(socket);


  // emit连接的事件
  socket.emit('onconnect', {
    id: socket.id,
  });

  // /chat命名的socket操作
  // 发送好友请求
  socket.on('addFriendRequest', chat.addFriendRequest(socket));
  // 处理好友请求
  socket.on('handleFriendRequest', chat.handleFriendRequest(socket));
  // 拉黑好友
  socket.on('handleAddBlackListRequest', chat.handleAddBlackListRequest(socket));
  // 移除好友请求黑名单
  socket.on('handleRemoveFromBlackList', chat.handleRemoveFromBlackList(socket));
  // 删除好友
  socket.on('deleteFriendRequest', chat.deleteFriendRequest(socket))

  // 广场聊天模块
  socket.on('join', square.join(socket));
  socket.on('sendMessage', square.sendMessage(socket));
  socket.on('leave', square.leave(socket));

  // 私人聊天
  socket.on('privateMessage', chat.privateMessage(socket));

  
  socket.on('disconnect', (reason) => {
    console.log('someone disconnect ----', reason);
    // 删除在线用户
    chat.removeChatUser(socket);
    // 模块掉线操作
    square.disconnect(socket);
  })

  // 错误处理
  socket.on('error', (error) => {
    console.log('拦截socket错误', error);
    socket.emit('service-error', error);
  });

}