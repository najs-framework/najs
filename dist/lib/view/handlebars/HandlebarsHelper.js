"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
class HandlebarsHelper {
    constructor(context, controller) {
        this.context = context;
        this.controller = controller;
    }
    isBlockHelper() {
        return typeof this.options !== 'undefined' && typeof this.options.fn === 'function';
    }
    renderChildren(blockParams) {
        return this.options.fn(this.context, { data: this.options.data, blockParams: blockParams });
    }
    static create(helper, controller, ...args) {
        return function () {
            const options = arguments[arguments.length - 1];
            const instance = najs_binding_1.make(helper, [this, controller, ...args]);
            instance.options = options;
            return instance.run.apply(instance, arguments);
        };
    }
}
exports.HandlebarsHelper = HandlebarsHelper;
