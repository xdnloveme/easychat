/**
 * @file 头像的controller层
 * @author tangyida <530063113@qq.com>
 */

const getAvatarList = async ctx => {
  const avatarList = [
    '/head1.jpeg',
    '/head2.jpeg',
    '/head3.jpeg',
    '/head4.jpeg',
    '/head5.jpeg',
    '/head6.jpeg',
    '/head7.jpeg',
    '/head8.jpeg',
    '/head9.jpeg',
    '/head10.jpeg',
    '/head11.jpeg',
    '/head12.jpeg',
    '/head13.jpeg',
    '/head14.jpeg',
    '/head15.jpeg',
    '/head16.jpeg',
    '/head17.jpeg',
    '/head18.jpeg',
    '/head19.jpeg',
    '/head20.jpeg',
    '/head21.jpeg',
  ]
  ctx.state.response.success(0, '头像列表', { avatarList });
};

module.exports = {
  getAvatarList
};
