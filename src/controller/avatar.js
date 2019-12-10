/**
 * @file 头像的controller层
 * @author tangyida <530063113@qq.com>
 */

const getAvatarList = async ctx => {
  const avatarList = [
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head1.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head2.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head3.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head4.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head5.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head6.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head7.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head8.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head9.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head10.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head11.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head12.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head13.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head14.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head15.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head16.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head17.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head18.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head19.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head20.jpeg',
    'http://xdnloveme.oss-cn-shanghai.aliyuncs.com/chat/head21.jpeg',
  ]
  ctx.state.response.success(0, '头像列表', { avatarList });
};

module.exports = {
  getAvatarList
};
