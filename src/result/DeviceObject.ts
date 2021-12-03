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