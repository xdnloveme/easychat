/**
 * @file 数据库连接池配置
 * @author tangyida <530063113@qq.com>
 */

const Sequelize = require('sequelize');
const { host, user, password, database } = require('../config/dbConfig');

const sequelize = new Sequelize(
  database, 
  user, 
  password, 
  {
    host: host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      // `timestamps` 字段指定是否将创建 `createdAt` 和 `updatedAt` 字段.
      timestamps: false
    }
  }
);

module.exports = sequelize;