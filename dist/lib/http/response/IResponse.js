"use strict";
/// <reference path="../../contracts/HttpDriver.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function isIResponse(arg) {
    return typeof arg !== 'undefined' && lodash_1.isFunction(arg.respond);
}
exports.isIResponse = isIResponse;
