/**
 * @file 用户好友表的orm操作
 * @license <MIT>
 * @author tangyida <530063113@qq.com>
 */
const { UserChatRecord, User } = require('../model')
const sequelize = require('../../config/orm')
const { Op } = require('sequelize')

const addLastChatRecord = async ({ openId, mapOpenId, message, createdAt }) => {
  try {
    return sequelize.transaction(t => {
      return UserChatRecord.findOne({
        where: {
          openId: {
            [Op.or]: [openId, mapOpenId],
          },
          mapOpenId: {
            [Op.or]: [openId, mapOpenId],
          },
        },
        defaults: {
          message,
          createdAt,
          sourceOpenId: openId,
        },
        transaction: t,
      }).then(result => {
        if (result) {
          return UserChatRecord.update(
            {
              message,
              createdAt,
              sourceOpenId: openId,
            },
            {
              where: {
                openId: {
                  [Op.or]: [openId, mapOpenId],
                },
                mapOpenId: {
                  [Op.or]: [openId, mapOpenId],
                },
              },
              transaction: t,
            },
          )
        } else {
          return UserChatRecord.findOrCreate({
            where: {
              openId,
              mapOpenId,
            },
            defaults: {
              message,
              createdAt,
              sourceOpenId: openId,
            },
            transaction: t,
          }).then(() => {
            return {
              isCommit: true,
              step: 1,
            }
          })
        }
      })
    })
  } catch (e) {
    throw e
  }
}

const getChatRecord = async openId => {
  try {
    const result = await UserChatRecord.findAll({
      attributes: [
        'openId',
        'mapOpenId',
        'message',
        'createdAt',
        'sourceOpenId',
      ],
      include: [
        {
          model: User,
          as: 'publicInfo',
          attributes: ['openId', 'nickname', 'sex', 'signature', 'avatar'],
        },
        {
          model: User,
          as: 'mapPublicInfo',
          attributes: ['openId', 'nickname', 'sex', 'signature', 'avatar'],
        },
      ],
      where: {
        [Op.or]: [
          {
            openId,
          },
          {
            mapOpenId: openId,
          },
        ],
      },
    })
    return result.map(item => {
      const {
        message,
        createdAt,
        publicInfo,
        mapPublicInfo,
        sourceOpenId,
      } = item
      const sourcePublicInfo =
        sourceOpenId === item.openId ? publicInfo : mapPublicInfo
      const targetPublicInfo =
        sourceOpenId === item.openId ? mapPublicInfo : publicInfo
      return {
        message,
        timestamp: createdAt,
        sourceOpenId,
        sourcePublicInfo,
        targetPublicInfo,
        targetOpenId: targetPublicInfo.openId,
      }
    })
  } catch (e) {}
}

module.exports = {
  addLastChatRecord,
  getChatRecord,
}
