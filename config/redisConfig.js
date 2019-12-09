/**
 * @file redis缓存数据库配置
 * @author tangyida <530063113@qq.com>
 */

const bluebird = require('bluebird'); 

const redis = require("redis");
bluebird.promisifyAll(redis);
const client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

client.monitor(function (err, res) {
  debug_redis("Entering monitoring mode.");
});

client.on("monitor", function (time, args, raw_reply) {
  debug_redis(`【operate】<${args[0]}>: [key]: ${args[1]}, value: ${args.slice(2, args.length - 1)} \n 【 reply 】: ${raw_reply[3]}`);
});

module.exports = {
  client,
  redis
}

