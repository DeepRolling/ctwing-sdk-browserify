import {BaseOperate} from "./BaseOperate";
import {SubscriptionsObject} from "../result/SubscriptionsObject";


/**
 * 消息订阅操作
 */
export class SubscriptionsOperate extends BaseOperate {
    path: string = "aep_subscribe_north"
    module: string = ""
    declare ProductID: number; //产品编号，从平台获取
    constructor(ProductID: number = 0) {
        super()
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
    async Create(DeviceID: string, Level: number, Operator: string,
                 Url: string, Types: [number]): Promise<SubscriptionsObject> {
        this.version = "20181031202018"
        this.module = "subscription"
        let data: any = JSON.stringify({
            deviceId: DeviceID,
            operator: Operator,
            productId: this.ProductID,
            subLevel: Level,
            subTypes: Types,
            subUrl: Url
        })
        return await this.post(data);
    }

    /**
     * 删除设备北向订阅
     * @param DeviceID 设备ID
     * @param SubID 订阅记录ID
     * @param Level 订阅级别,必填(1:产品级 2：设备级)
     */
    async Delete(DeviceID: string, SubID: number, Level: number): Promise<SubscriptionsObject> {
        this.version = "20181031202023"
        this.module = "subscription"
        return await this.delete({
            subId: SubID, deviceId: DeviceID,
            productId: this.ProductID,
            subLevel: Level
        })
    }

    /**
     * 根据subid查询设备北向订阅信息
     * @param SubID 订阅记录id
     */
    async Query(SubID: number): Promise<SubscriptionsObject> {
        this.version = "20181031202033"
        this.module = "subscription"
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
    async QueryList(P: number, N: number, Types: number,
                    SV?: string): Promise<SubscriptionsObject> {
        this.version = "20181031202027"
        this.module = "subscribes"
        return await this.get({
            productId: this.ProductID,
            pageNow: P,
            pageSize: N, subType: Types, searchValue: SV
        })
    }

}