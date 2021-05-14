import axios from 'axios'
import * as query from 'querystring'
import * as crypto from 'crypto'
import * as moment from 'moment';

export namespace ctwing {
    /**
     * 时间偏移量
     */
    export var time_offset: number = 200;
    // export var appKey: string = "";
    // export var appSecret: string = "";
    // export var MasterKey: string = "";
    // export var version: string = "";
    // export var params: any = {};
    // export var MK: boolean = true //MasterKey 是否参与加密，默认参与
    // export var ProductID: number = 0;
    /**
     * 设备对象
     */
    export interface DeviceObject {
        /**
         * 设备ID，
         */
        deviceId: string;
        deviceName: string;
        dmpId?: any;
        tenantId: string;
        productId: number;
        imei: string;
        imsi?: any;
        firmwareVersion?: any;
        deviceStatus: number;
        deviceStatusStr?: any;
        token?: any;
        secret?: any;
        autoObserver: number;
        lastTime?: any;
        createTime?: any;
        createBy: string;
        updateTime?: any;
        updateBy?: any;
        apn?: any;
        iotVer?: any;
        mvendor?: any;
        mver?: any;
        netStatus?: any;
        onlineAt?: any;
        offlineAt?: any;
        tupVendorId?: any;
        tupDeviceModel?: any;
        tupDeviceType?: any;
        tupIsProfile: number;
        psk?: any;
        sn?: any;
        certData?: any;
        taskState?: any;
        nbDeviceResourceInfos?: any;
    }

    /**
     * 删除设备返回result
     */
    export interface DelDeviceObject {
        /**
         * 设备编号
         */
        deviceId: string;
        /**
         * 返回提示信息
         */
        reason: string
    }

    /**
     * 订阅对象
     */
    export interface SubscriptionsObject {
        pageNum: number;
        pageSize: number;
        size: number;
        startRow: number;
        endRow: number;
        total: number;
        pages: number;
        list: SubscriptionsList[];
        firstPage: number;
        prePage: number;
        nextPage: number;
        lastPage: number;
        isFirstPage: boolean;
        isLastPage: boolean;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
        navigatePages: number;
        navigatepageNums: number[];
    }
    /**
     * 订阅对象子对象
     */
    export interface SubscriptionsList {
        subId: number;
        productId: number;
        tenantId: string;
        deviceId: string;
        subType: number;
        subLevel: number;
        subUrl: string;
        createTime: string;
        createBy: string;
        updateTime: string;
        updateBy?: any;
        isSub: number;
        isDel: number;
    }
    /**
     * 指令发送结果
     */
    export interface CommandSendResult {
        commandId: string;
        command: string;
        /**
         * 指令已发送,
         */
        commandStatus: string;
        productId: number;
        deviceId: string;
        createBy: string;
        createTime: number;
    }

    /**
     * 批量查询指令返回详情
     */
    interface ComQuery {
        /**
         * 当前页数
         */
        pageNum: number;
        /**
         * 每页条数
         */
        pageSize: number;
        /**
         * 总条数
         */
        total: number;
        list: ComQuerylist[];
    }

    /**
     * 查询单个指令详情返回对象
     */
    interface ComQuerylist {
        /**
         * 指令ID
         */
        commandId: string;
        /**
         * 产品ID
         */
        productId: number;
        /**
         * 设备ID
         */
        deviceId: string;
        deviceSn?: any;
        /**
         * 设备imei号
         */
        imei: string;
        /**
         * payload内容 案例{"int":1}
         */
        command: string;
        /**
         * 操作员
         */
        createBy: string;
        /**
         * 创建时间 精确到毫秒的时间戳
         */
        createTime: number;
        /**
         * 完成时间 精确到毫秒的时间戳
         */
        finishTime?: any;
        /**
         * 指令下发状态
         */
        commandStatus: string;
        /**
         * 指令执行结果
         */
        resultCode: string;
        /**
         * 执行结果及错误信息
         */
        resultMessage?: any;
    }

    /**
     * 获取时间偏移量，精确到毫秒
     */
    export async function get_time() {
        let start = Date.now()
        let rs = await axios.get('https://ag-api.ctwing.cn/echo');
        let end = Date.now();
        ctwing.time_offset = Math.ceil((rs.headers['x-ag-timestamp'] || Date.now()) - ((end + start) / 2))
    }

    /**
     * 请求库
     */
    export class Request {
        // host: string = "https://ag-api.ctwing.cn/aep___MODULE___management";
        host: string = "https://ag-api.ctwing.cn/";
        path: string = "" //请求地址中间路径
        module: string = ""; //通用请求地址后缀
        ProductID: number = 0;

        appKey: string = "";
        appSecret: string = "";
        MasterKey: string = "";
        version: string = "";
        params: any = {};
        MK: boolean = true;
        req = axios.create({
            withCredentials: true
        })
        constructor() {

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
            })
            this.req.interceptors.response.use((data) => {
                // if(data.data.)
                if (data.data.code != 0) {
                    throw new Error(data.data.msg || data.data.desc);
                }
                return data.data.result || data.data;
            })

        }

        /**
         * 加密
         * @param data body请求体
         * @param timestamp 
         * @param params url参数
         */
        sign(data: any, timestamp: number, params: any) {
            // console.log("加密体-->", data);
            let qs: any
            if ((typeof data) == "string") { //数据是JSON对象加密方法
                if (JSON.stringify(params) != '{}') { //有请求参数加密方法
                    qs = `application:${this.appKey}\ntimestamp:${timestamp}\nMasterKey:${this.MasterKey}\n` +
                        query.stringify(params).replace(/=/g, ':').split('&').sort().join("\n") + '\n' + data + '\n'
                    this.params = {}
                } else { //无请求参数，只有body加密方法
                    if (this.MK) { //MasterKey参与加密
                        qs = `application:${this.appKey}\ntimestamp:${timestamp}\nMasterKey:${this.MasterKey}\n`
                            + data + '\n'
                    } else {//MasterKey参与加密不参与加密
                        qs = `application:${this.appKey}\ntimestamp:${timestamp}\n`
                            + data + '\n'
                    }
                }
            } else {  //数据是对象加密方法
                qs = `application:${this.appKey}\ntimestamp:${timestamp}\nMasterKey:${this.MasterKey}\n` +
                    query.stringify(data).replace(/=/g, ':').split('&').sort().join("\n") + '\n'
            }

            // console.log("整理后加密体:\n", qs)
            return crypto.createHmac('sha1', this.appSecret).update(qs).digest().toString('base64');
        }

        geturl() {
            return [this.host + this.path, this.module].join('/')
        }
        seturl(data: any) {
            let Url = this.geturl() + "?"
            for (let v in data) {
                if (data[v]) {
                    Url += v + "=" + data[v] + '&'
                }
            }
            // console.log(Url);
            return Url
        }
        async post(data: { [index: string]: string | number | any } | any): Promise<any> {
            // console.log('上传数据-->', data)
            return await this.req.post(this.geturl(), data);
        }
        async get(data: { [index: string]: string | number }): Promise<any> {
            // console.log('上传数据-->', data)
            return await this.req({
                method: "GET",
                url: this.seturl(data),
                data,
            })
        }
        async delete(data: { [index: string]: string | number }): Promise<any> {
            // return await req.delete(this.geturl(), data);
            // console.log('上传数据-->', data)
            return await this.req({
                method: "DELETE",
                url: this.seturl(data),
                data,
            })
        }
        async put(data: { [index: string]: string | number } | any,
            params: { [index: string]: string | number }): Promise<any> {
            return await this.req({
                method: "PUT",
                url: this.seturl(params),
                data,
            })
        }
    }
    /**
     * 设备操作
     */
    export class Device extends Request {
        path: string = "aep_device_management"
        module: string = "";
        ProductID: number;
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
        async Update(DeviceID: String, Name: string, Operator: string,
            Opt: { Auto?: number, IMSI?: string }): Promise<DeviceObject> {
            this.module = "device"
            let params: any = {}
            params["deviceId"] = DeviceID
            this.version = "20181031202122"
            this.params = params
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

    /**
     * 消息订阅操作
     */
    export class Subscriptions extends Request {
        path: string = "aep_subscribe_north"
        module: string = ""
        ProductID: number; //产品编号，从平台获取
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
    /**
     * 指令处理
     */
    export class Command extends Request {
        path: string = "aep_device_command"
        module: string = "command"
        DeviceID: string = "";
        constructor(DeviceID: string) {
            super();
            this.ProductID = this.ProductID;
            this.DeviceID = DeviceID;
        }
        /**
         * 指令发送
         * @param data 
         */
        async send(data: Buffer): Promise<CommandSendResult> {
            this.version = "20190712225145"
            this.module = "command"
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
            }
            return await this.post(JSON.stringify(body));
        }
        /**
         * 发送JSON内容
         * @param data 
         */
        async sendJSON(data: { [index: string]: any }): Promise<CommandSendResult> {
            this.version = "20190712225145"
            this.module = "command"
            let body = {
                content: data,
                deviceId: this.DeviceID,
                operator: "ctsy",
                productId: this.ProductID,
                "ttl": 0,
                "deviceGroupId": 100,
                "level": 1
            }
            return await this.post(JSON.stringify(body));
        }
        /**
         * 取消指令
         * @param CommandID 指令ID
         */
        async Cancel(CommandID: string): Promise<any> {
            this.version = "20190615023142"
            this.module = "cancelCommand"
            let body = {
                commandId: CommandID,
                deviceId: this.DeviceID,
                productId: this.ProductID
            }
            return await this.put(JSON.stringify(body), {})
        }

        /**
         * 指令查询查询
         * @param CommandID 创建指令成功响应中返回的ID
         */
        async query(CommandID: string): Promise<ComQuerylist> {
            this.version = "20190712225241"
            this.module = "command"
            return await this.get({ commandId: CommandID, productId: this.ProductID, deviceId: this.DeviceID })
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
        async queryList(Search?: string, Status?: number, StartTime?: string, EndTime?: string,
            P?: number, N?: number, GroupComID?: string): Promise<ComQuery> {
            this.version = "20190712225211"
            this.module = "commands"
            let data: any = {
                productId: this.ProductID,
                searchValue: Search,
                deviceId: this.DeviceID,
                status: Status,
                startTime: StartTime,
                endTime: EndTime,
                pageNow: P,
                pageSize: N,
                groupCommandId: GroupComID
            }
            return await this.get(data)
        }
    }
    /**
     * 设备状态数据操作
     */
    export class Data extends Request {
        path: string = "aep_device_status"
        module: string = ""
        ProductID: number
        constructor(ProductID: number = 0) {
            super()
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
        async QueryPage(DeviceID: string, N: number, BeginTime: string,
            EndTime: string) {
            this.version = "20190928013337"
            this.MK = false
            this.module = "getDeviceStatusHisInPage"
            let data: any = JSON.stringify({
                productId: this.ProductID || this.ProductID,
                deviceId: DeviceID,
                begin_timestamp: BeginTime,
                end_timestamp: EndTime,
                page_size: N,
                page_time: JSON.stringify(Date.now())
            })
            return await this.post(data)
        }

        /**
         * 设备状态数据总数查询
         * @param DeviceID 设备ID
         * @param BeginTime 开始时间，13位时间戳
         * @param EndTime 结束时间，13位时间戳
         */
        async QueryTotal(DeviceID: string, BeginTime: string, EndTime: string): Promise<number> {
            this.version = "20190928013529"
            this.MK = false
            this.module = "api/v1/getDeviceStatusHisInTotal"
            let data: any = JSON.stringify({
                productId: this.ProductID,
                deviceId: DeviceID,
                begin_timestamp: BeginTime,
                end_timestamp: EndTime,
            })
            return (await this.post(data)).total;
        }

        /**
         * 终端单个最新状态查询
         * @param DeviceID 设备ID
         * @param MName 待查询的设备上报消息中某个属性的名称
         */
        async Query(DeviceID: string, MName: string) {
            this.version = "20181031202028"
            this.MK = false
            this.module = "deviceStatus"
            let data: any = JSON.stringify({
                productId: this.ProductID,
                deviceId: DeviceID,
                datasetId: MName
            })
            return await this.post(data)
        }

        /**
         * 设备最新状态批量查询
         * @param DeviceID 设备ID
         */
        async QueryList(DeviceID: string): Promise<{
            /**
             * 
             */
            timestamp: number,
            /**
             * base64数据内容
             */
            value: string
        }> {
            this.version = "20181031202403"
            this.MK = false
            this.module = "deviceStatusList"
            let data: any = JSON.stringify({
                productId: this.ProductID || this.ProductID,
                deviceId: DeviceID
            })
            return (await this.post(data)).deviceStatusList;
        }
    }
}

export default ctwing