# 中国电信 物联网平台 AEP 平台 www.ctwing.cn NodejsApi

```typescript
import { ctwing } from "./index";
(async () => {
  let ProductID = 10022900;
  let appKey = "";
  let appSecret = "";
  let MasterKey = "";
  let DeviceID = "";
  let device = new ctwing.Device(ProductID);
  device.appKey = appKey;
  device.MasterKey = MasterKey;
  device.appSecret = appSecret;
  let sub = new ctwing.Subscriptions(ProductID);
  sub.appKey = appKey;
  sub.MasterKey = MasterKey;
  sub.appSecret = appSecret;
  let data = new ctwing.Data(ProductID);
  data.appKey = appKey;
  data.MasterKey = MasterKey;
  data.appSecret = appSecret;
  let com = new ctwing.Command(DeviceID);
  com.appKey = appKey;
  com.MasterKey = MasterKey;
  com.appSecret = appSecret;
  try {
    let rs = await device.Create(
      "we7658e729c74c01a79fa46a6",
      "test1001test",
      "YYY",
      {}
    );
    rs = await device.Delete("we7658e729c74c01a79fa46a694eaff1");
    rs = await device.Update(
      "67fde26edb074611aabdb870872b3b22",
      "test1001test11",
      "YYY",
      {}
    );
    rs = await device.Query("be7658e729c74c01a79fa46a694eaff1");
    rs = await device.Query("67fde26edb074611aabdb870872b3b22");
    rs = await device.QueryList("");
    // --------- 设备订阅操作---------------------
    rs = await sub.Create(
      "67fde26edb074611aabdb870872b3b22",
      2,
      "YYY",
      "www.baidu.com",
      [1]
    );
    rs = await sub.Delete("be7658e729c74c01a79fa46a694eaff1", 1, 1);
    rs = await sub.Query(10022900);
    rs = await sub.QueryList(1, 10, 1);
    // --------- 数据状态查询---------------------
    rs = await data.QueryPage(
      "2d5750603d28403d85b784a852ed24c6",
      5,
      "1571456132140",
      JSON.stringify(Date.now())
    );
    rs = await data.QueryTotal(
      "2d5750603d28403d85b784a852ed24c6",
      "1571456132140",
      JSON.stringify(Date.now())
    );
    rs = await data.Query("2d5750603d28403d85b784a852ed24c6", "temperature");
    rs = await data.QueryList("2d5750603d28403d85b784a852ed24c6");
    // ----------设备指令操作---------
    rs = await com.send(Buffer.from("0102", "hex"));
    rs = await com.Cancel("2");
    rs = await com.query("2");
    rs = await com.queryList();
  } catch (error) {
    console.log(error.message);
  }
})();
```
