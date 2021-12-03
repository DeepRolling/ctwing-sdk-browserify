"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataOperate = void 0;
const BaseOperate_1 = require("./BaseOperate");
/**
 * 设备状态数据操作
 */
class DataOperate extends BaseOperate_1.BaseOperate {
    path = "aep_device_status";
    module = "";
    constructor(ProductID = 0) {
        super();
        this.ProductID = ProductID || this.ProductID;
    }
    /**
     * 设备状态历史数据分页查询
     * 请求中page_timestamp第一页查询时，可传空或end_timestamp，
     * 第二页开始需使用返回值中的page_timestamp。
     * 若返回值中page_timestamp为空，则说明无下一页数据.
     * @param DeviceID 设备ID
     * @param N 查询条数
     * @param BeginTime 开始时间，13位时间戳
     * @param EndTime 结束时间，13位时间戳
     */
    async QueryPage(DeviceID, N, BeginTime, EndTime) {
        this.version = "20190928013337";
        this.MK = false;
        this.module = "getDeviceStatusHisInPage";
        let data = JSON.stringify({
            productId: this.ProductID || this.ProductID,
            deviceId: DeviceID,
            begin_timestamp: BeginTime,
            end_timestamp: EndTime,
            page_size: N,
            page_time: JSON.stringify(Date.now())
        });
        return await this.post(data);
    }
    /**
     * 设备状态数据总数查询
     * @param DeviceID 设备ID
     * @param BeginTime 开始时间，13位时间戳
     * @param EndTime 结束时间，13位时间戳
     */
    async QueryTotal(DeviceID, BeginTime, EndTime) {
        this.version = "20190928013529";
        this.MK = false;
        this.module = "api/v1/getDeviceStatusHisInTotal";
        let data = JSON.stringify({
            productId: this.ProductID,
            deviceId: DeviceID,
            begin_timestamp: BeginTime,
            end_timestamp: EndTime,
        });
        return (await this.post(data)).total;
    }
    /**
     * 终端单个最新状态查询
     * @param DeviceID 设备ID
     * @param MName 待查询的设备上报消息中某个属性的名称
     */
    async Query(DeviceID, MName) {
        this.version = "20181031202028";
        this.MK = false;
        this.module = "deviceStatus";
        let data = JSON.stringify({
            productId: this.ProductID,
            deviceId: DeviceID,
            datasetId: MName
        });
        return await this.post(data);
    }
    /**
     * 设备最新状态批量查询
     * @param DeviceID 设备ID
     */
    async QueryList(DeviceID) {
        this.version = "20181031202403";
        this.MK = false;
        this.module = "deviceStatusList";
        let data = JSON.stringify({
            productId: this.ProductID || this.ProductID,
            deviceId: DeviceID
        });
        return (await this.post(data)).deviceStatusList;
    }
}
exports.DataOperate = DataOperate;
//# sourceMappingURL=DataOperate.js.map