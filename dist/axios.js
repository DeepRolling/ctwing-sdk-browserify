"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const requester = axios_1.default.create({
    withCredentials: true
});
exports.default = requester;
//# sourceMappingURL=axios.js.map