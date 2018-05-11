"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function isResponse(arg) {
    return typeof arg !== 'undefined' && lodash_1.isFunction(arg.respond);
}
exports.isResponse = isResponse;
