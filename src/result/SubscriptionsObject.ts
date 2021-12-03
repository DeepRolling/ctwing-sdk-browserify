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