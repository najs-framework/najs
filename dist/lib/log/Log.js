"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../constants");
const make_1 = require("../core/make");
exports.Log = make_1.make(constants_1.LoggerClass);
function reload() {
    exports.Log = make_1.make(constants_1.LoggerClass);
    return exports.Log;
}
exports.reload = reload;
