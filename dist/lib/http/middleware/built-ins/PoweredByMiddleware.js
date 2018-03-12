"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressMiddlewareBase_1 = require("../ExpressMiddlewareBase");
const najs_binding_1 = require("najs-binding");
class PoweredByMiddleware extends ExpressMiddlewareBase_1.ExpressMiddlewareBase {
    getClassName() {
        return PoweredByMiddleware.className;
    }
    parseIdentify(...args) {
        this.identify = 'powered-by';
        return this.identify;
    }
    parseLevel(level) {
        this.isAppLevel = true;
        return true;
    }
    parseParams(...args) {
        this.poweredBy = args[1] || 'Najs/Express';
        return this.poweredBy;
    }
    createMiddleware() {
        if (!exports.PoweredBySetter) {
            exports.PoweredBySetter = (request, response, next) => {
                response.setHeader('X-Powered-By', this.poweredBy);
                next();
            };
        }
        return exports.PoweredBySetter;
    }
}
PoweredByMiddleware.className = 'Najs.PoweredByMiddleware';
exports.PoweredByMiddleware = PoweredByMiddleware;
najs_binding_1.register(PoweredByMiddleware);
