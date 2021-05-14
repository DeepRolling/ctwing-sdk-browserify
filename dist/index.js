"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctwing = void 0;
const axios_1 = require("axios");
const query = require("querystring");
const crypto = require("crypto");
const moment = require("moment");
var ctwing;
(function (ctwing) {
    /**
     * 时间偏移量
     */
    ctwing.time_offset = 200;
    /**
     * 获取时间偏移量，精确到毫秒
     */
    async function get_time() {
        let start = Date.now();
        let rs = await axios_1.default.get('https://ag-api.ctwing.cn/echo');
        let end = Date.now();
        ctwing.time_offset = Math.ceil((rs.headers['x-ag-timestamp'] || Date.now()) - ((end + start) / 2));
    }
    ctwing.get_time = get_time;
    /**
     * 请求库
     */
    class Request {
        constructor() {
            // host: string = "https://ag-api.ctwing.cn/aep___MODULE___management";
            this.host = "https://ag-api.ctwing.cn/";
            this.path = ""; //请求地址中间路径
            this.module = ""; //通用请求地址后缀
            this.ProductID = 0;
            this.appKey = "";
            this.appSecret = "";
            this.MasterKey = "";
            this.version = "";
            this.params = {};
            this.MK = true;
            this.req = axios_1.default.create({
                withCredentials: true
            });
            this.req.interceptors.request.use((conf) => {
                //完成对象转:后再做字典序排序
                conf.headers['MasterKey'] = this.MasterKey;
                conf.headers['application'] = this.appKey;
                conf.headers['sdk'] = 0;
                conf.headers['version'] = this.version;
                conf.headers['timestamp'] = Date.now() + ctwing.time_offset;
                // conf.headers['timestamp'] = 1571324571528;
                conf.headers['Date'] = moment(conf.headers['timestamp']).format("YYYY-MM-DD HH:mm:ss");
                // conf.headers['Date'] = new Date(conf.headers['timestamp']).toISOString();
                // console.log(conf.headers['Date'])
                // conf.data['MasterKey'] = ctwing.MasterKey;
                conf.headers['signature'] = this.sign(conf.data, conf.headers['timestamp'], this.params);
                // console.log(conf.headers['signature'], ctwing.time_offset)
                // if (conf.method.toUpperCase() == 'GET') {
                //     conf.url += ("?" + query.stringify(conf.data).split('&').sort().join('&')) //
                //     console.log("===", conf.url);
                //     delete conf.data
                // }
                // console.log(conf.url)
                return conf;
            });
            this.req.interceptors.response.use((data) => {
                // if(data.data.)
                if (data.data.code != 0) {
                    throw new Error(data.data.msg || data.data.desc);
                }
                return data.data.result || data.data;
            });
        }
        /**
         * 加密
         * @param data body请求体
         * @param timestamp
         * @param params url参数
         */
        sign(data, timestamp, params) {
            // console.log("加密体-->", data);
            let qs;
            if ((typeof data) == "string") { //数据是JSON对象加密方法
                if (JSON.stringify(params) != '{}') { //有请求参数加密方法
                    qs = `application:${this.appKey}\ntimestamp:${timestamp}\nMasterKey:${this.MasterKey}\n` +
                        query.stringify(params).replace(/=/g, ':').split('&').sort().join("\n") + '\n' + data + '\n';
                    this.params = {};
                }
                else { //无请求参数，只有body加密方法
                    if (this.MK) { //MasterKey参与加密
                        qs = `application:${this.appKey}\ntimestamp:${timestamp}\nMasterKey:${this.MasterKey}\n`
                            + data + '\n';
                    }
                    else { //MasterKey参与加密不参与加密
                        qs = `application:${this.appKey}\ntimestamp:${timestamp}\n`
                            + data + '\n';
                    }
                }
            }
            else { //数据是对象加密方法
                qs = `application:${this.appKey}\ntimestamp:${timestamp}\nMasterKey:${this.MasterKey}\n` +
                    query.stringify(data).replace(/=/g, ':').split('&').sort().join("\n") + '\n';
            }
            // console.log("整理后加密体:\n", qs)
            return crypto.createHmac('sha1', this.appSecret).update(qs).digest().toString('base64');
        }
        geturl() {
            return [this.host + this.path, this.module].join('/');
        }
        seturl(data) {
            let Url = this.geturl() + "?";
            for (let v in data) {
                if (data[v]) {
                    Url += v + "=" + data[v] + '&';
                }
            }
            // console.log(Url);
            return Url;
        }
        async post(data) {
            // console.log('上传数据-->', data)
            return await this.req.post(this.geturl(), data);
        }
        async get(data) {
            // console.log('上传数据-->', data)
            return await this.req({
                method: "GET",
                url: this.seturl(data),
                data,
            });
        }
        async delete(data) {
            // return await req.delete(this.geturl(), data);
            // console.log('上传数据-->', data)
            return await this.req({
                method: "DELETE",
                url: this.seturl(data),
                data,
            });
        }
        async put(data, params) {
            return await this.req({
                method: "PUT",
                url: this.seturl(params),
                data,
            });
        }
    }
    ctwing.Request = Request;
    /**
     * 设备操作
     */
    class Device extends Request {
        constructor(ProductID = 0) {
            super();
            this.path = "aep_device_management";
            this.module = "";
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
        async Create(Name, IMEI, Operator, Opt, DeviceSn) {
            this.version = "20181031202117";
            this.module = "device";
            let data = JSON.stringify({
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
            });
            return await this.post(data);
        }
        /**
         * 删除设备
         * @param DeviceID 设备ID，从平台获取
         */
        async Delete(DeviceID) {
            this.version = "20181031202131";
            this.module = "device";
            return await this.delete({ productId: this.ProductID, deviceIds: DeviceID });
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
        async Update(DeviceID, Name, Operator, Opt) {
            this.module = "device";
            let params = {};
            params["deviceId"] = DeviceID;
            this.version = "20181031202122";
            this.params = params;
            let data = JSON.stringify({
                deviceName: Name,
                operator: Operator,
                other: {
                    autoObserver: Opt.Auto || 1,
                    imsi: Opt.IMSI || '',
                },
                productId: this.ProductID || this.ProductID,
            });
            return await this.put(data, params);
        }
        /**
         * 获取单个设备详情
         * @param DeviceID 设备序列号
         */
        async Query(DeviceID) {
            this.version = "20181031202139";
            this.module = "device";
            return await this.get({ deviceId: DeviceID, productId: this.ProductID });
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
        async QueryList(SearchValue, P, N) {
            // this.version = "20181031202147" 
            this.version = "20190507012134";
            this.module = "devices";
            let data = {
                productId: this.ProductID,
                searchValue: SearchValue || '',
                pageNow: P || '',
                pageSize: N || ''
            };
            return await this.get(data);
        }
    }
    ctwing.Device = Device;
    /**
     * 消息订阅操作
     */
    class Subscriptions extends Request {
        constructor(ProductID = 0) {
            super();
            this.path = "aep_subscribe_north";
            this.module = "";
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
    ctwing.Subscriptions = Subscriptions;
    /**
     * 指令处理
     */
    class Command extends Request {
        constructor(DeviceID) {
            super();
            this.path = "aep_device_command";
            this.module = "command";
            this.DeviceID = "";
            this.ProductID = this.ProductID;
            this.DeviceID = DeviceID;
        }
        /**
         * 指令发送
         * @param data
         */
        async send(data) {
            this.version = "20190712225145";
            this.module = "command";
            let body = {
                "content": {
                    payload: data.toString('hex'),
                    dataType: 2,
                    isReturn: 1,
                },
                "deviceId": this.DeviceID,
                "operator": "ctsy",
                "productId": this.ProductID,
                "ttl": 0,
                "deviceGroupId": 100,
                "level": 1
            };
            return await this.post(JSON.stringify(body));
        }
        /**
         * 发送JSON内容
         * @param data
         */
        async sendJSON(data) {
            this.version = "20190712225145";
            this.module = "command";
            let body = {
                content: data,
                deviceId: this.DeviceID,
                operator: "ctsy",
                productId: this.ProductID,
                "ttl": 0,
                "deviceGroupId": 100,
                "level": 1
            };
            return await this.post(JSON.stringify(body));
        }
        /**
         * 取消指令
         * @param CommandID 指令ID
         */
        async Cancel(CommandID) {
            this.version = "20190615023142";
            this.module = "cancelCommand";
            let body = {
                commandId: CommandID,
                deviceId: this.DeviceID,
                productId: this.ProductID
            };
            return await this.put(JSON.stringify(body), {});
        }
        /**
         * 指令查询查询
         * @param CommandID 创建指令成功响应中返回的ID
         */
        async query(CommandID) {
            this.version = "20190712225241";
            this.module = "command";
            return await this.get({ commandId: CommandID, productId: this.ProductID, deviceId: this.DeviceID });
        }
        /**
         * 批量查询指令详情
         * @param Search 模糊查询
         * LWM2M协议可选填:IMEI号或指令Id;
         * TUP协议可选填:IMEI号或指令Id;
         * T-link协议可选填:设备编号或指令Id;
         * MQTT协议可选填:设备编号或指令Id
         * @param Status 状态可选填： 1：指令已保存 2：指令已发送 3：指令已送达 4：指令已完成 6：指令已取消 999：指令发送失败
         * @param StartTime 精确到毫秒的时间戳
         * @param EndTime 精确到毫秒的时间戳
         * @param P 当前页数
         * @param N 每页记录数
         * @param GroupComID 群组任务ID
         */
        async queryList(Search, Status, StartTime, EndTime, P, N, GroupComID) {
            this.version = "20190712225211";
            this.module = "commands";
            let data = {
                productId: this.ProductID,
                searchValue: Search,
                deviceId: this.DeviceID,
                status: Status,
                startTime: StartTime,
                endTime: EndTime,
                pageNow: P,
                pageSize: N,
                groupCommandId: GroupComID
            };
            return await this.get(data);
        }
    }
    ctwing.Command = Command;
    /**
     * 设备状态数据操作
     */
    class Data extends Request {
        constructor(ProductID = 0) {
            super();
            this.path = "aep_device_status";
            this.module = "";
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
    ctwing.Data = Data;
})(ctwing = exports.ctwing || (exports.ctwing = {}));
exports.default = ctwing;
//# sourceMappingURL=index.js.map