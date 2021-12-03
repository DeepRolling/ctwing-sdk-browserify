import {BaseOperate} from "./BaseOperate";
import {DeviceObject} from "../result/DeviceObject";
import {DelDeviceObject} from "../result/DelDeviceObject";

/**
 * 设备操作
 */
export class DeviceOperate extends BaseOperate {
    path: string = "aep_device_management"
    module: string = "";
    declare ProductID: number;

    constructor(ProductID: number = 0) {
        super()
        this.ProductID = ProductID || this.ProductID;
    }

    /**
     * 创建设备
     * @param Name 设备名称
     * @param IMEI IMEI号，入网认证凭证
     * @param Operator 操作者
     * @param Opt 可选参数
     * Auto 0.自动订阅 1.取消自动订阅;
     * IMSI 总长度不超过15位，使用0~9的数字
     * @param DeviceSn 设备编号，MQTT,T_Link,TCP,HTTP,JT/T808协议必填
     */
    async Create(Name: string, IMEI: string, Operator: string,
                 Opt: { Auto?: number, IMSI?: string, PSK?: string }, DeviceSn?: string): Promise<DeviceObject> {
        this.version = "20181031202117"
        this.module = "device"
        let data: any = JSON.stringify({
            deviceName: Name,
            deviceSn: DeviceSn || '',
            imei: IMEI,
            operator: Operator,
            other: {
                autoObserver: Opt.Auto == undefined ? Opt.Auto : 0,
                imsi: Opt.IMSI || '',
                pskValue: Opt.PSK || '',
            },
            productId: this.ProductID
        })
        return await this.post(data);
    }

    /**
     * 删除设备
     * @param DeviceID 设备ID，从平台获取
     */
    async Delete(DeviceID: string): Promise<DelDeviceObject> {
        this.version = "20181031202131"
        this.module = "device"
        return await this.delete({productId: this.ProductID, deviceIds: DeviceID});
    }

    /**
     * 更新设备
     * @param DeviceID 设备ID，从平台获取
     * @param Name 设备名称
     * @param Operator 操作者
     * @param Opt 可选参数
     * Auto 0.自动订阅 1.取消自动订阅;
     * IMSI 总长度不超过15位，使用0~9的数字
     */
    async Update(DeviceID: String, Name: string, Operator: string,
                 Opt: { Auto?: number, IMSI?: string }): Promise<DeviceObject> {
        this.module = "device"
        let params: any = {deviceId: DeviceID}
        this.version = "20181031202122"
        let data: any = JSON.stringify({
            deviceName: Name,
            operator: Operator,
            other: {
                autoObserver: Opt.Auto || 1,
                imsi: Opt.IMSI || '',
            },
            productId: this.ProductID || this.ProductID,
        })
        return await this.put(data, params);
    }

    /**
     * 获取单个设备详情
     * @param DeviceID 设备序列号
     */
    async Query(DeviceID: string): Promise<DeviceObject> {
        this.version = "20181031202139"
        this.module = "device"
        return await this.get({deviceId: DeviceID, productId: this.ProductID});
    }

    /**
     * 批量获取设备信息
     * @param SearchValue 模糊查询参数可以为空
     * T-link协议可选填: 设备名称 || 设备编号 ||设备Id;
     * MQTT协议可选填: 设备名称 || 设备编号 || 设备Id;
     * LWM2M协议可选填: 设备名称 || 设备Id || IMEI号;
     * TUP协议可选填: 设备名称 || 设备Id || IMEI号;
     * TCP协议可选填: 设备名称 || 设备编号 || 设备Id;
     * HTTP协议可选填: 设备名称 || 设备编号 || 设备Id;
     * JT / T808协议可选填: 设备名称 || 设备编号 || 设备Id;
     * @param P 当前页数
     * @param N 每页记录数
     */
    async QueryList(SearchValue?: string, P?: number,
                    N?: number): Promise<DeviceObject> {
        // this.version = "20181031202147"
        this.version = "20190507012134"
        this.module = "devices"
        let data: any = {
            productId: this.ProductID,
            searchValue: SearchValue || '',
            pageNow: P || '',
            pageSize: N || ''
        }
        return await this.get(data);
    }


}