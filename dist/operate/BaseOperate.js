"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOperate = void 0;
const moment = require("moment");
const crypto_es_1 = require("crypto-es");
const config_1 = require("../config");
const axios_1 = require("../axios");
/**
 * 请求库
 */
class BaseOperate {
    // host: string = "https://ag-api.ctwing.cn/aep___MODULE___management";
    host = "https://ag-api.ctwing.cn/";
    path = ""; //请求地址中间路径
    module = ""; //通用请求地址后缀
    MasterKey = "";
    version = "";
    MK = true;
    constructor() {
        //fuck the document of ctwing
        //one said you should only pass four common header when you request interface(https://www.ctwing.cn/channel-help-api.htm?api=99)
        //another code put some extra header to request(https://www.ctwing.cn/yykf/132)
        //fuck the stupid cunt
        axios_1.default.interceptors.request.use((conf) => {
            conf.headers['MasterKey'] = this.MasterKey;
            conf.headers['application'] = config_1.appKey;
            conf.headers['version'] = this.version;
            conf.headers['timestamp'] = Date.now() + config_1.timeOffset;
            conf.headers['Date'] = moment(conf.headers['timestamp']).format("YYYY-MM-DD HH:mm:ss");
            conf.headers['signature'] = this.sign(conf.data, conf.headers['timestamp'], conf.params);
            return conf;
        });
        axios_1.default.interceptors.response.use((data) => {
            if (data.data === undefined) {
                // notice : some times , the callback data is parsed data , I don't know why , but this if is an workaround
                // console.log('response : '+JSON.stringify(data))
                //response : {"commandId":"11","command":"{\"status\":1,\"temperature\":26}","commandStatus":"指令已保存","productId":15107165,"deviceId":"15107165123","imei":null,"createBy":"ctsy","createTime":1638502139622,"ttl":0}
                return data;
            }
            // console.log('debug ctwing , data type is :' + typeof data);
            // console.log('debug ctwing , data value is :' + JSON.stringify(data));
            // console.log('debug ctwing , data.data type is :' + typeof data.data);
            // console.log('debug ctwing , data.data value is :' + JSON.stringify(data.data));
            // console.log('debug ctwing , code type is :' + typeof data.data.code);
            if (data.data.code != 0) {
                throw new Error(data.data.msg || data.data.desc);
            }
            return data.data.result || data.data;
        });
    }
    parseParams = (data) => {
        try {
            const tempArr = [];
            for (const i in data) {
                const key = encodeURIComponent(i);
                const value = encodeURIComponent(data[i]);
                tempArr.push(key + '=' + value);
            }
            return tempArr.join('&');
        }
        catch (err) {
            return '';
        }
    };
    /**
     * 加密
     * @param data body请求体 , maybe formatted with json-string or object
     * @param timestamp
     * @param params url参数
     */
    sign(data, timestamp, params) {
        // console.log("加密体-->", data);
        let qs;
        if ((typeof data) == "string") { //数据是JSON对象加密方法
            if (params !== undefined && JSON.stringify(params) != '{}') { //有请求参数加密方法
                //if some request set params and params not empty , stringify the params
                qs = `application:${config_1.appKey}\ntimestamp:${timestamp}\n` +
                    this.parseParams(params).replace(/=/g, ':').split('&').sort().join("\n") + '\n' + data + '\n';
            }
            else { //无请求参数，只有body加密方法
                if (this.MK) { //MasterKey参与加密
                    qs = `application:${config_1.appKey}\ntimestamp:${timestamp}\n`
                        + data + '\n';
                }
                else { //MasterKey参与加密不参与加密
                    qs = `application:${config_1.appKey}\ntimestamp:${timestamp}\n`
                        + data + '\n';
                }
            }
        }
        else { //数据是对象加密方法
            qs = `application:${config_1.appKey}\ntimestamp:${timestamp}\n` +
                this.parseParams(data).replace(/=/g, ':').split('&').sort().join("\n") + '\n';
        }
        // console.log("整理后加密体:\n", qs)
        return crypto_es_1.default.HmacSHA1(qs, config_1.appSecret).toString(crypto_es_1.default.enc.Base64);
    }
    getUrl() {
        return [this.host + this.path, this.module].join('/');
    }
    setUrl(data) {
        let Url = this.getUrl() + "?";
        for (let v in data) {
            if (data[v]) {
                Url += v + "=" + data[v] + '&';
            }
        }
        // console.log(Url);
        return Url;
    }
    async post(data, params) {
        // console.log('上传数据-->', data)
        return axios_1.default.post(this.getUrl(), data, {
            params: params
        });
    }
    async get(data, params) {
        // console.log('上传数据-->', data)
        return (0, axios_1.default)({
            method: "GET",
            url: this.setUrl(data),
            data,
            params: params
        });
    }
    async delete(data, params) {
        // console.log('上传数据-->', data)
        return (0, axios_1.default)({
            method: "DELETE",
            url: this.setUrl(data),
            data,
            params: params
        });
    }
    async put(data, params) {
        return (0, axios_1.default)({
            method: "PUT",
            url: this.setUrl(params),
            data,
            params: params
        });
    }
}
exports.BaseOperate = BaseOperate;
//# sourceMappingURL=BaseOperate.js.map