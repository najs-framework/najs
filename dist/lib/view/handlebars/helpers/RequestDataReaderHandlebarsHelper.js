"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HandlebarsHelper_1 = require("../HandlebarsHelper");
class RequestDataReaderHandlebarsHelper extends HandlebarsHelper_1.HandlebarsHelper {
    constructor(context, controller, property) {
        super(context, controller);
        this.property = property;
    }
    getClassName() {
        return RequestDataReaderHandlebarsHelper.className;
    }
    run(command, ...args) {
        const isBlockHelper = this.isBlockHelper();
        if (!this.controller || !this.controller[this.property]) {
            return isBlockHelper ? undefined : '';
        }
        // if this is block helper, it's perform "has" function
        if (isBlockHelper) {
            return this.controller[this.property].has(command) ? this.renderChildren([]) : undefined;
        }
        switch (command.toLowerCase()) {
            case 'except':
            case 'only':
                Reflect.apply(this.controller[this.property][command], this.controller[this.property], Array.from(arguments).slice(1, arguments.length));
                return undefined;
            case 'has':
            case 'exists':
            case 'all':
                return Reflect.apply(this.controller[this.property][command], this.controller[this.property], Array.from(arguments).slice(1, arguments.length));
            default:
                if (arguments.length === 2) {
                    return this.controller[this.property].get(command);
                }
                return this.controller[this.property].get(arguments[1]);
        }
    }
}
RequestDataReaderHandlebarsHelper.className = 'Najs.RequestDataReaderHandlebarsHelper';
exports.RequestDataReaderHandlebarsHelper = RequestDataReaderHandlebarsHelper;
najs_binding_1.register(RequestDataReaderHandlebarsHelper);
