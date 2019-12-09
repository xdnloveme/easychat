/**
 * @file 登录的controller层
 * @author tangyida <530063113@qq.com>
 */
const loginService = require('@src/service/user/login');
const { emailValidate } = require('@src/utils/validation')

const login = async (ctx) => {
    let { username, password } = ctx.request.body;
    const isEmail = emailValidate(username).state;
    // 验证用户信息是否正确
    const { id, publicInfo } = await loginService.validateUser({ userInput: username, password, isEmail });
    // 登陆成功，签发token
    const token = await loginService.loginSign({ username, password, id, publicInfo });
    ctx.state.response.success(0, '登录成功', { token, publicInfo });    
}

const authToken = async (ctx) => {
    const { publicInfo } = await loginService.getUserInfoByToken(ctx);
    ctx.state.response.success(0, '验证通过', { publicInfo });    
}

const logout = async (ctx) => {
    await loginService.deleteSign(ctx)
    ctx.state.response.success(0, '登出成功');
}

module.exports = {
    login,
    logout,
    authToken,
}
