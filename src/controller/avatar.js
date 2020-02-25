/**
 * @file 头像的controller层
 * @author tangyida <530063113@qq.com>
 */

const getAvatarList = async ctx => {
  const avatarList = [
    'https://blog.tangyida.top/chat/head1.jpeg',
    'https://blog.tangyida.top/chat/head2.jpeg',
    'https://blog.tangyida.top/chat/head3.jpeg',
    'https://blog.tangyida.top/chat/head4.jpeg',
    'https://blog.tangyida.top/chat/head5.jpeg',
    'https://blog.tangyida.top/chat/head6.jpeg',
    'https://blog.tangyida.top/chat/head7.jpeg',
    'https://blog.tangyida.top/chat/head8.jpeg',
    'https://blog.tangyida.top/chat/head9.jpeg',
    'https://blog.tangyida.top/chat/head10.jpeg',
    'https://blog.tangyida.top/chat/head11.jpeg',
    'https://blog.tangyida.top/chat/head12.jpeg',
    'https://blog.tangyida.top/chat/head13.jpeg',
    'https://blog.tangyida.top/chat/head14.jpeg',
    'https://blog.tangyida.top/chat/head15.jpeg',
    'https://blog.tangyida.top/chat/head16.jpeg',
    'https://blog.tangyida.top/chat/head17.jpeg',
    'https://blog.tangyida.top/chat/head18.jpeg',
    'https://blog.tangyida.top/chat/head19.jpeg',
    'https://blog.tangyida.top/chat/head20.jpeg',
    'https://blog.tangyida.top/chat/head21.jpeg',
  ]
  ctx.state.response.success(0, '头像列表', { avatarList });
};

module.exports = {
  getAvatarList
};
