"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressMiddlewareBase_1 = require("./ExpressMiddlewareBase");
const ExpressRequestId = require('express-request-id');
class RequestIdMiddleware extends ExpressMiddlewareBase_1.ExpressMiddlewareBase {
    parseIdentify(...args) {
        return 'request-id';
    }
    parseLevel(level) {
        this.isAppLevel = true;
        return true;
    }
    createMiddleware() {
        if (!exports.RequestIdGenerator) {
            exports.RequestIdGenerator = ExpressRequestId();
        }
        return exports.RequestIdGenerator;
    }
}
RequestIdMiddleware.className = 'Najs.RequestIdMiddleware';
exports.RequestIdMiddleware = RequestIdMiddleware;
