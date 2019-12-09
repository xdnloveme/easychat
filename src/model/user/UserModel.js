/**
 * @file User表映射实体模型（所有实例模型的方法封装）
 * @author tangyida <530063113@qq.com>
 */
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = class UserModel extends Model {
  // 公开信息
  getPublicInfo () {
    return {
      nickname: this.nickname,
      sex: this.sex,
      signature: this.signature,
      openId: this.openId,
      avatar: this.avatar,
      district: this.district,
    }
  }
}
