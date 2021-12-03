/**
 * 时间偏移量
 */
let timeOffset: number = 200;
/**
 * 申请应用时的密钥
 */
let appKey: string = "";
let appSecret: string = "";

function injectCTWingConfiguration(appKeyValue:string,appSecretValue:string,timeOffsetValue?:number){
    appKey = appKeyValue;
    appSecret = appSecretValue;
    if (timeOffsetValue !== undefined) {
        timeOffset = timeOffsetValue
    }
}


export {timeOffset,appKey,appSecret,injectCTWingConfiguration}