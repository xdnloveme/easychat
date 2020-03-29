# easychat
简聊(easychat)✨✨，服务端代码，与easychat-web搭配食用，基于node的koa2框架

# 开始

## 安装

> ⚠️ 警告：在安装前请确保MAC环境下已经安装Mysql 5.7以上，同时已经安装redis并启动服务redis-server，导入sql结构至数据库

全局安装nodemon

```javascript
	npm install -g nodemon
```

安装依赖

```bash
	npm install
```

运行在开发环境下

```javascript
  npm run dev
```

# 文档

#### 项目结构

```javascript
.
├── README.md
├── bin
│   └── www
├── config
│   ├── dbConfig.js // 数据库配置
│   ├── env.js // 一些环境变量
│   ├── index.js // 配置入口
│   ├── orm.js // orm模块配置
│   ├── redisConfig.js // redis服务配置
│   └── socketIo.js // socket配置
├── easychat.sql // 导入至数据库的sql模型
├── package-lock.json 
├── package.json
├── public
├── server
│   ├── server.js // 主线程服务器
│   └── socket_server.js // socket 服务器
├── src
│   ├── app.js // 项目入口
│   ├── controller // controller 层
│   │   ├── avatar.js
│   │   └── user
│   ├── middlewares // 各类中间件
│   │   ├── Authorization.js // JWT控制接口权限
│   │   ├── AuthorizationSocket.js // JWT控制socket权限
│   │   ├── CrossDomain.js // 跨域（有可能的话）
│   │   └── UnifiedErrorHandle.js // 统一错误处理
│   ├── model // 数据模型层
│   │   ├── friendRequestMap // 所有文件都一致，分别是结构，模型和index（好友请求model）
│   │   │   ├── FriendRequestMapModel.js
│   │   │   ├── index.js
│   │   │   └── structure.js
│   │   ├── index.js
│   │   ├── user // 用户表
│   │   ├── userBlackListMap // 用户黑名单表
│   │   ├── userChatRecord // 用户最后一次聊天的记录（单次记录）
│   │   ├── userFriendsMap // 用户好友映射表
│   │   └── userIdPool // 用户简聊号池
│   ├── orm // orm数据映射交互层
│   │   ├── FriendRequest.js
│   │   ├── User.js
│   │   ├── UserBlackListMap.js
│   │   ├── UserChatRecord.js
│   │   └── UserFriendsMap.js
│   ├── router // api路由地址控制
│   │   ├── avatar
│   │   │   └── index.js
│   │   ├── index.js
│   │   └── user
│   │       ├── index.js
│   │       ├── login.js
│   │       ├── public.js
│   │       └── user.js
│   ├── service // service层，用于碎片化业务逻辑分发
│   │   ├── common.js
│   │   └── user
│   │       ├── login.js
│   │       ├── register.js
│   │       └── user.js
│   ├── socket // socket事件
│   │   ├── chat
│   │   │   ├── events.js
│   │   │   ├── index.js
│   │   │   ├── modules
│   │   │   │   ├── chat.js
│   │   │   │   └── square.js
│   │   │   └── namespace.js
│   │   └── index.js
│   ├── utils // 工具类
│   │   ├── common.js // 通用工具
│   │   ├── errorHandle // 统一错误处理
│   │   │   ├── code.js // 部分错误码映射关系（权限）
│   │   │   ├── index.js 
│   │   │   └── message.js // 自定义错误码以及信息
│   │   ├── global // 全局变量
│   │   │   ├── debug.js
│   │   │   ├── error_handler.js
│   │   │   └── index.js
│   │   ├── mail // 邮件发送器
│   │   │   ├── config.js
│   │   │   ├── mail.js
│   │   │   └── template.js
│   │   ├── responseContent.js // 接口返回内容结构包
│   │   ├── sign // 权限签名工具方法
│   │   │   ├── expiresTime.js
│   │   │   └── token.js
│   │   └── validation.js // 参数验证方法
│   └── views // 部分可视化页面（比如激活成功页面）
│       └── index.ejs
```






