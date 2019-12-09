/**
 * @file user模型对象orm
 * @author tangyida <530063113@qq.com>
 */

const UserChatRecord = require('./UserChatRecord');
const structure = require('./structure');
const sequelize = require('@root/config/orm');

UserChatRecord.init(structure, {
  sequelize,
  modelName: 'user_chat_record',
  freezeTableName: true,
});

module.exports = UserChatRecord;