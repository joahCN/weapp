/**
 * Created by mac on 17/10/21.
 */
let {mysql} = require("../qcloud.js");
let _ = require("lodash");

const tableName = "hourses";
const livingHourseType = 1; //people living hourse

// let hourseInfo = {
//     locationLa: '',
//     locationLo: '',
//     locationName: '',
//     endDate: '',
//     startDate: '',
//     hourseType: '',
//     contactImgs: '',
//     hourseImgs: '',
//     checkedBasicAsssets: '',
//     phoneNumber: '',
//     wechatNumber: '',
//     discountAssets: '',
//     discountPrice: '',
//     originalPrice: '',
//     building: '',
//     status: '',
//     createdTime: '',
//     userId: ''
// }


let uploadHourseInfo = async (ctx, next) => {
    let body = ctx.request.body;
    let hourseInfo = _.pick(body, ["endDate", "startDate", "hourseType", "contactImgs",
        "hourseImgs", "checkedBasicAsssets", "phoneNumber", "wechatNumber",
        "discountAssets", "discountPrice", "originalPrice", "building", "status", "userId"]);

    // let {location, endDate, startDate, hourseType, contactImgs,
    //     hourseImgs, checkedBasicAsssets, phoneNumber, wechatNumber,
    //     discountAssets, discountPrice, originalPrice, building, status, userId} = body;

    hourseInfo.locationLo = body.location.longitude;
    hourseInfo.locationLa = body.location.latitude;
    hourseInfo.locationName = body.location.address;
    hourseInfo.contactImgs = hourseInfo.contactImgs.join(",");
    hourseInfo.hourseImgs = hourseInfo.hourseImgs.join(",");
    hourseInfo.createdTime = Date.now();
    hourseInfo.checkedBasicAsssets = body.checkedBasicAsssets.join(",");
    try {
        await mysql(tableName).insert(hourseInfo);
    } catch (e) {
        ctx.state.code = 1001;
        ctx.state.data = "添加失败";
    }

};

const queryType = {
    0: 'self',
    1: 'all'
};

let queryHourseList = async (ctx, next) => {

    let queryType = ctx.request.body.type;
    let userId = ctx.request.body.userId;
    let results;
    if(userId) {
        results = await mysql.select("*").from(tableName).where({userId: userId});
    } else {
        results = await mysql.select("*").from(tableName).where({status: 0});
    }
    
    ctx.state.data = results;
    

};


module.exports = {
    uploadHourseInfo,
    queryHourseList
}