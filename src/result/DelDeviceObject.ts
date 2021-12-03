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