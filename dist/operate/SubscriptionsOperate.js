"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsOperate = void 0;
const BaseOperate_1 = require("./BaseOperate");
/**
 * 消息订阅操作
 */
class SubscriptionsOperate extends BaseOperate_1.BaseOperate {
    path = "aep_subscribe_north";
    module = "";
    constructor(ProductID = 0) {
        super();
        this.ProductID = ProductID || this.ProductID;
    }
    /**
     * 创建设备北向订阅
     * @param DeviceID 设备ID (产品级可以不填,设备级必填)
     * @param Level 订阅级别,必填(1:产品级 2：设备级)
     * @param Operator 操作者
     * @param Url 消息接收路径，接收消息的url(必填)
     * @param Types 消息类型 可填写1个或多个(1表示设备数据变化通知、
     * 2表示设备响应命令通知,3设备事件上报通知，4设备上下线通知)
     */
    async Create(DeviceID, Level, Operator, Url, Types) {
        this.version = "20181031202018";
        this.module = "subscription";
        let data = JSON.stringify({
            deviceId: DeviceID,
            operator: Operator,
            productId: this.ProductID,
            subLevel: Level,
            subTypes: Types,
            subUrl: Url
        });
        return await this.post(data);
    }
    /**
     * 删除设备北向订阅
     * @param DeviceID 设备ID
     * @param SubID 订阅记录ID
     * @param Level 订阅级别,必填(1:产品级 2：设备级)
     */
    async Delete(DeviceID, SubID, Level) {
        this.version = "20181031202023";
        this.module = "subscription";
        return await this.delete({
            subId: SubID, deviceId: DeviceID,
            productId: this.ProductID,
            subLevel: Level
        });
    }
    /**
     * 根据subid查询设备北向订阅信息
     * @param SubID 订阅记录id
     */
    async Query(SubID) {
        this.version = "20181031202033";
        this.module = "subscription";
        return await this.get({
            subId: SubID,
            productId: this.ProductID
        });
    }
    /**
     * 查询设备北向订阅信息列表
     * @param P 当前页
     * @param N 每页条数
     * @param Types 订阅类型
     * @param SV 检索 设备ID 模糊匹配
     */
    async QueryList(P, N, Types, SV) {
        this.version = "20181031202027";
        this.module = "subscribes";
        return await this.get({
            productId: this.ProductID,
            pageNow: P,
            pageSize: N, subType: Types, searchValue: SV
        });
    }
}
exports.SubscriptionsOperate = SubscriptionsOperate;
//# sourceMappingURL=SubscriptionsOperate.js.map