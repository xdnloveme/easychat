/**
 * @file 头像的controller层
 * @author tangyida <530063113@qq.com>
 */

const getAvatarList = async ctx => {
  const avatarList = [
    'http://blog.tangyida.top/chat/head1.jpeg',
    'http://blog.tangyida.top/chat/head2.jpeg',
    'http://blog.tangyida.top/chat/head3.jpeg',
    'http://blog.tangyida.top/chat/head4.jpeg',
    'http://blog.tangyida.top/chat/head5.jpeg',
    'http://blog.tangyida.top/chat/head6.jpeg',
    'http://blog.tangyida.top/chat/head7.jpeg',
    'http://blog.tangyida.top/chat/head8.jpeg',
    'http://blog.tangyida.top/chat/head9.jpeg',
    'http://blog.tangyida.top/chat/head10.jpeg',
    'http://blog.tangyida.top/chat/head11.jpeg',
    'http://blog.tangyida.top/chat/head12.jpeg',
    'http://blog.tangyida.top/chat/head13.jpeg',
    'http://blog.tangyida.top/chat/head14.jpeg',
    'http://blog.tangyida.top/chat/head15.jpeg',
    'http://blog.tangyida.top/chat/head16.jpeg',
    'http://blog.tangyida.top/chat/head17.jpeg',
    'http://blog.tangyida.top/chat/head18.jpeg',
    'http://blog.tangyida.top/chat/head19.jpeg',
    'http://blog.tangyida.top/chat/head20.jpeg',
    'http://blog.tangyida.top/chat/head21.jpeg',
  ]
  ctx.state.response.success(0, '头像列表', { avatarList });
};

module.exports = {
  getAvatarList
};
