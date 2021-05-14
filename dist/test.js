"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
(async () => {
    let ProductID = 10022900;
    let appKey = "";
    let appSecret = "";
    let MasterKey = "";
    let DeviceID = "";
    let device = new index_1.ctwing.Device(ProductID);
    device.appKey = appKey;
    device.MasterKey = MasterKey;
    device.appSecret = appSecret;
    let sub = new index_1.ctwing.Subscriptions(ProductID);
    sub.appKey = appKey;
    sub.MasterKey = MasterKey;
    sub.appSecret = appSecret;
    let data = new index_1.ctwing.Data(ProductID);
    data.appKey = appKey;
    data.MasterKey = MasterKey;
    data.appSecret = appSecret;
    let com = new index_1.ctwing.Command(DeviceID);
    com.appKey = appKey;
    com.MasterKey = MasterKey;
    com.appSecret = appSecret;
    try {
        // debugger
        //         await ctwing.get_time();
        //         let rs: any
        //         //---------设备操作-----------------------
        // let rs = await device.Create("we7658e729c74c01a79fa46a6", "test1001test", "YYY", {});
        // rs = await device.Delete("we7658e729c74c01a79fa46a694eaff1",);
        // rs = await device.Update("67fde26edb074611aabdb870872b3b22", "test1001test11", "YYY", {});
        // rs = await device.Query('be7658e729c74c01a79fa46a694eaff1');
        // rs = await device.Query('67fde26edb074611aabdb870872b3b22');
        // rs = await device.QueryList('');
        // // --------- 设备订阅操作---------------------
        // rs = await sub.Create('67fde26edb074611aabdb870872b3b22', 2, 'YYY', "www.baidu.com", [1]);
        // rs = await sub.Delete('be7658e729c74c01a79fa46a694eaff1', 1, 1);
        // rs = await sub.Query(10022900);
        // rs = await sub.QueryList(1, 10, 1);
        // // --------- 数据状态查询---------------------
        // rs = await data.QueryPage('2d5750603d28403d85b784a852ed24c6', 5, "1571456132140", JSON.stringify(Date.now()))
        // rs = await data.QueryTotal('2d5750603d28403d85b784a852ed24c6', "1571456132140", JSON.stringify(Date.now()))
        // rs = await data.Query("2d5750603d28403d85b784a852ed24c6", "temperature")
        // rs = await data.QueryList("2d5750603d28403d85b784a852ed24c6")
        // // ----------设备指令操作---------
        // rs = await com.send(Buffer.from('0102', 'hex'))
        // rs = await com.Cancel("2")
        // rs = await com.query("2")
        // rs = await com.queryList()
    }
    catch (error) {
        console.log(error.message);
    }
})();
//# sourceMappingURL=test.js.map