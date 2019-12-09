/**
 * @file user模型对象orm
 * @author tangyida <530063113@qq.com>
 */

const UserIdPool = require('./UserIdPoolModel');
const structure = require('./structure');
const sequelize = require('../../../config/orm');

UserIdPool.init(structure, {
  sequelize,
  modelName: 'user_id_pool',
  freezeTableName: true,
});

module.exports = UserIdPool;