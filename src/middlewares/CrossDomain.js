module.exports = () => {
  return async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");
    ctx.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type, Authorization");
    ctx.set("Content-Type", "application/json;charset=utf-8");
    // 拦截options请求，直接完成请求返回
    if(ctx.request.method.toLocaleLowerCase() === 'options'){
      ctx.status = 204;
      ctx.response.body = {};
    }else{
      await next();
    }
  }
}