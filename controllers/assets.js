let {mysql} = require("../qcloud.js");

const tableName = "assets";

// 查询房屋类型接口
module.exports = async (ctx, next) => {
    await mysql.select("*").from(tableName).then((rows)=>{
        ctx.state.data = rows;
    })
}