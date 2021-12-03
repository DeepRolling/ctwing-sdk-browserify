"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectCTWingConfiguration = exports.appSecret = exports.appKey = exports.timeOffset = void 0;
/**
 * 时间偏移量
 */
let timeOffset = 200;
exports.timeOffset = timeOffset;
/**
 * 申请应用时的密钥
 */
let appKey = "";
exports.appKey = appKey;
let appSecret = "";
exports.appSecret = appSecret;
function injectCTWingConfiguration(appKeyValue, appSecretValue, timeOffsetValue) {
    exports.appKey = appKey = appKeyValue;
    exports.appSecret = appSecret = appSecretValue;
    if (timeOffsetValue !== undefined) {
        exports.timeOffset = timeOffset = timeOffsetValue;
    }
}
exports.injectCTWingConfiguration = injectCTWingConfiguration;
//# sourceMappingURL=config.js.map