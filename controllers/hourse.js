/**
 * Created by mac on 17/10/21.
 */
let {mysql} = require("../qcloud.js");
let _ = require("lodash");
let geolib = require("geolib");

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

const distance = 3000; //3km around.$sql = "SELECT *, ( 3959 * acos( cos( radians(" . $lat . ") ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(" . $lng . ") ) + sin( radians(" . $lat . ") ) * sin( radians( lat ) ) ) ) AS distance FROM your_table HAVING distance < 5";
const bearing = 45;

//SELECT *, ( 3959 * acos( cos( radians(39.90377) ) * cos( radians( locationLa ) ) * cos( radians( locationLo ) - radians(116.39949) ) + sin( radians(39.90377) ) * sin( radians( locationLa ) ) ) ) AS distance FROM hourses HAVING distance < 5;


let queryHourseList = async (ctx, next) => {

    let query = ctx.request.query;
    let queryType = query.type;
    let userId = query.userId;
    let latitude = query.latitude;
    let longitude = query.longitude;
    let hourseId = query.hourseId;

    let whereClause = "";
    let rawSQL = "";

    if(userId) {
        whereClause = `where userId = "${userId}"`;
    } else if(hourseId) {
        whereClause = `where id = ${hourseId}`;
    } else {
        whereClause = `where status = 0`;
    }


    if(latitude && longitude) {
        rawSQL = `SELECT *, ( 3959 * acos( cos( radians(${latitude}) ) * cos( radians( locationLa ) ) * cos( radians( locationLo ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( locationLa ) ) ) ) AS distance FROM ${tableName} ${whereClause} HAVING distance < 5;`
    } else {
        rawSQL = `select * from ${tableName} ${whereClause}`;
    }

    let results =  await mysql.raw(rawSQL);

    // if(userId) {
    //     results = await mysql.select("*").from(tableName).where({userId: userId});
    // } else {
    //     results = await mysql.select("*").from(tableName).where({status: 0});
    // }
    
    ctx.state.data = results[0];
    

};

//edit hourse item status;
let editHourseItem = async (ctx, next) => {
    let body = ctx.request.body;
    let userId = body.userId;
    let hourseId = body.hourseId;
    if(userId != ctx.state.$wxInfo.userinfo.openId) {
        ctx.state = {
            code: -1,
            data: "没有权限修改"
        };
        
    } else {
        await mysql(tableName).where('id', '=', hourseId)
            .update({
                status: '1'
            });

        ctx.state.data = "update success";

    }
    
}


module.exports = {
    uploadHourseInfo,
    queryHourseList,
    editHourseItem
}