const { uploader } = require('../qcloud');
const multiparty = require('multiparty');
const config = require('../config');

module.exports = async ctx => {
    // 获取上传之后的结果
    // 具体可以查看：
    if(config.cosEnabled) {
        const data = await uploader(ctx.req);
        ctx.state.data = data;
    } else {
        const maxSize = config.cos.maxSize ? config.cos.maxSize : 10;
        const form = new multiparty.Form({
            encoding: 'utf8',
            maxFilesSize: maxSize * 1024 * 1024,
            autoFiles: true,
            uploadDir: config.imgDir
        });

        // 从 req 读取文件
        let uploadResult = await new Promise((resolve, reject)=>{
            form.parse(ctx.req, (err, fields = {}, files = {}) => {
                if(err) {
                    reject(err);
                } else {
                    console.log(files.file[0]);
                    resolve({imgUrl: files.file[0].path.split("/")[1]})
                }
            });
        });

        ctx.state.data = uploadResult;
    }



}
