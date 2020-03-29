/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : easychat

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 29/03/2020 23:58:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for friend_request_map
-- ----------------------------
DROP TABLE IF EXISTS `friend_request_map`;
CREATE TABLE `friend_request_map` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `openId` varchar(32) COLLATE utf8_bin NOT NULL,
  `requestOpenId` varchar(32) COLLATE utf8_bin NOT NULL,
  `message` longtext COLLATE utf8_bin,
  `createdAt` bigint(20) DEFAULT NULL,
  `isExpired` int(1) DEFAULT '0',
  `isAgreed` int(1) DEFAULT '0',
  `isFinish` int(1) DEFAULT '0',
  `isAddBlackList` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户唯一id，主键',
  `userId` varchar(32) COLLATE utf8_bin NOT NULL COMMENT '用户计数id（用于从号码池生成公开号码）',
  `openId` varchar(32) COLLATE utf8_bin NOT NULL COMMENT '用户公开号码',
  `username` varchar(16) COLLATE utf8_bin NOT NULL COMMENT '用户账号',
  `password` varchar(30) COLLATE utf8_bin NOT NULL COMMENT '用户密码',
  `nickname` varchar(12) COLLATE utf8_bin NOT NULL COMMENT '用户昵称',
  `email` varchar(32) COLLATE utf8_bin NOT NULL COMMENT '用户邮箱',
  `ip` varchar(16) COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '用户访问ip',
  `sex` int(1) DEFAULT '1' COMMENT '用户性别(1为男,0为女)',
  `isActive` int(1) DEFAULT '0' COMMENT '是否激活',
  `signature` varchar(30) COLLATE utf8_bin DEFAULT NULL COMMENT '个性签名',
  `avatar` varchar(128) COLLATE utf8_bin DEFAULT NULL COMMENT '用户头像地址',
  `district` varchar(32) COLLATE utf8_bin DEFAULT NULL COMMENT '用户地区',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for user_blacklist_map
-- ----------------------------
DROP TABLE IF EXISTS `user_blacklist_map`;
CREATE TABLE `user_blacklist_map` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `openId` varchar(32) COLLATE utf8_bin NOT NULL,
  `blackOpenId` varchar(32) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for user_chat_record
-- ----------------------------
DROP TABLE IF EXISTS `user_chat_record`;
CREATE TABLE `user_chat_record` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `openId` varchar(32) COLLATE utf8_bin NOT NULL,
  `mapOpenId` varchar(32) COLLATE utf8_bin NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `createdAt` bigint(20) DEFAULT NULL,
  `sourceOpenId` varchar(32) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for user_friends_map
-- ----------------------------
DROP TABLE IF EXISTS `user_friends_map`;
CREATE TABLE `user_friends_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openId` varchar(32) COLLATE utf8_bin NOT NULL,
  `friendOpenId` varchar(32) COLLATE utf8_bin NOT NULL,
  `isBlackList` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Table structure for user_id_pool
-- ----------------------------
DROP TABLE IF EXISTS `user_id_pool`;
CREATE TABLE `user_id_pool` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `userId` int(32) DEFAULT NULL,
  `isLocked` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=326 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

SET FOREIGN_KEY_CHECKS = 1;
