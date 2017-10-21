let {mysql} = require("../qcloud.js");

const hourseTypeTable = "hourseType";
const livingHourseType = 1; //people living hourse

// 查询房屋类型接口
module.exports = async (ctx, next) => {
    await mysql.select("*").from(hourseTypeTable).where({type: livingHourseType}).then((rows)=>{
        let row = rows[0];
        ctx.state.data = row;
    })
}