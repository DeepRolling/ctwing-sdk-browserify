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