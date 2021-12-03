/**
 * 批量查询指令返回详情
 */
interface ComQueryResult {
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
    list: ComQueryList[];
}

/**
 * 查询单个指令详情返回对象
 */
interface ComQueryList {
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