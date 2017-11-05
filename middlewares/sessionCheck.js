/**
 * Created by mac on 17/11/4.
 */

/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功
        next();
    } else {
        ctx.state.code = -1
    }
}