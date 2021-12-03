import {BaseOperate} from "./BaseOperate";
import {CommandSendResult} from "../result/CommandSendResult";

/**
 * 指令处理
 */
export class CommandOperate extends BaseOperate {
    path: string = "aep_device_command"
    module: string = "command"
    DeviceID: string = "";
    declare ProductID: number;

    constructor(ProductId: number,MasterKey:string, DeviceID: string) {
        super();
        this.ProductID = ProductId;
        this.MasterKey = MasterKey;
        this.DeviceID = DeviceID;
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
        return await this.post(JSON.stringify(body), {
            MasterKey: this.MasterKey
        });
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
        return await this.put(JSON.stringify(body), {
            MasterKey: this.MasterKey
        })
    }

    /**
     * 指令查询查询
     * @param CommandID 创建指令成功响应中返回的ID
     */
    async query(CommandID: string): Promise<ComQueryList> {
        this.version = "20190712225241"
        this.module = "command"
        return await this.get({commandId: CommandID, productId: this.ProductID, deviceId: this.DeviceID}, {
            MasterKey: this.MasterKey
        })
    }

    /**
     * 批量查询指令详情
     * @param masterKey
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
                    P?: number, N?: number, GroupComID?: string): Promise<ComQueryResult> {
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
        return await this.get(data, {
            MasterKey: this.MasterKey
        })
    }
}