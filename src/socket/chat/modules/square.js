/**
 * @file socket通讯，广场模块实现
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
const namespace = require('../namespace');
// 当前房间名称
const ROOM_NAME = 'square';
// 房间内成员数组
let members = [];

const _getMembersKicked = (_membersArray, { memberInfo = {}, socket = {} }) => {
  let _members = [..._membersArray];
  if (_members.length > 0) {
    const index = _members.findIndex(item => memberInfo.openId === item.openId || socket.id === item.socketId);
    if (index !== -1) {
      _members.splice(index, 1);
    }
  }
  return _members;
};

// 踢出房间
const kickMembers = ({ memberInfo = {}, socket = {} }) => {
  members = _getMembersKicked(members, { memberInfo, socket });
};

module.exports.join = socket => {
  return (userInfo, callback) => {
    socket.join(ROOM_NAME, () => {
      let rooms = Object.keys(socket.rooms);
      console.log(rooms); // [ <socket.id>, 'room 237' ]
      const isExist = members.some(item => item.openId === userInfo.openId);
      const memberInfo = {
        ...userInfo,
        socketId: socket.id,
      };
      if (!isExist) {
        members.push(memberInfo);
      }
      debug_service('房间内共有成员', members);
      socket.emit('join-received', memberInfo);

      namespace.in(ROOM_NAME).emit('join-broadcast', {
        userCounts: members.length,
      });
      if (callback && typeof callback === 'function') {
        callback('房间内共有成员' + members);
      }
    });
  };
};

module.exports.sendMessage = socket => {
  return (socketId, message) => {
    namespace.to(ROOM_NAME).emit('sendMessage-received', {
      socketId,
      ...message,
    });
  };
};

module.exports.leave = socket => {
  return (memberInfo, callback) => {
    debug_service(`用户${memberInfo}离开房间`);
    socket.leave(ROOM_NAME, () => {
      kickMembers({
        memberInfo,
        socket,
      });
      socket.in(ROOM_NAME).emit('leave-broadcast', {
        userCounts: members.length,
      });
      const message = `用户${memberInfo.nickname}离开房间`;
      socket.emit('leave-received', message);
      if (callback && typeof callback === 'function') {
        callback(message);
      }
    });
  };
};

module.exports.disconnect = socket => {
  kickMembers({
    socket,
  });
  namespace.in(ROOM_NAME).emit('leave-broadcast', {
    userCounts: members.length,
  });
};

module.exports.kickMembers = kickMembers;
