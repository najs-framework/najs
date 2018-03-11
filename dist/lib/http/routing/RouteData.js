"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class RouteData {
    constructor(method, path) {
        this.isPrefixMerged = false;
        this.method = method;
        this.path = path;
        this.prefix = '';
        this.middleware = [];
    }
    isValid() {
        // An invalid route is
        //   1. method not found or empty
        //   2. path not found or empty
        //   3. have no controller & endpoint
        if (!this.hasRequiredData()) {
            return false;
        }
        // if endpoint is a function, it's is valid
        if (lodash_1.isFunction(this.endpoint)) {
            return true;
        }
        return this.hasEndpointInController();
    }
    hasEndpointInController() {
        if (!lodash_1.isString(this.endpoint) || typeof this.controller === 'undefined') {
            return false;
        }
        if (lodash_1.isFunction(this.controller) && !lodash_1.isFunction(this.controller.prototype[this.endpoint])) {
            return false;
        }
        if (typeof this.controller === 'object' && !lodash_1.isFunction(this.controller[this.endpoint])) {
            return false;
        }
        return true;
    }
    hasRequiredData() {
        return (typeof this.method !== 'undefined' &&
            this.method !== '' &&
            typeof this.path !== 'undefined' &&
            this.path !== '' &&
            typeof this.endpoint !== 'undefined');
    }
    mergeParentData(parent) {
        if (parent) {
            if (!this.isPrefixMerged) {
                this.prefix = parent.prefix + this.prefix;
                this.isPrefixMerged = true;
            }
            this.middleware = Array.from(new Set(parent.middleware.concat(this.middleware)));
        }
    }
    getData(parent) {
        if (!this.isValid()) {
            return undefined;
        }
        this.mergeParentData(parent);
        return {
            metadata: this.metadata,
            name: this.name,
            method: this.method,
            path: this.path,
            prefix: this.prefix,
            middleware: this.middleware,
            controller: this.controller,
            endpoint: this.endpoint
        };
    }
}
exports.RouteData = RouteData;
