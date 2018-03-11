"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HandlebarsHelper_1 = require("../HandlebarsHelper");
const GET_RESULT_ACTIONS = ['has', 'exists', 'all', 'except', 'only'];
class RequestDataReaderHandlebarsHelper extends HandlebarsHelper_1.HandlebarsHelper {
    constructor(context, controller, property) {
        super(context, controller);
        this.property = property;
    }
    getClassName() {
        return RequestDataReaderHandlebarsHelper.className;
    }
    isValid() {
        return !this.controller || !this.controller[this.property] ? false : true;
    }
    handleBlockHelper(key) {
        if (!this.isValid()) {
            return undefined;
        }
        return this.controller[this.property].has(key) ? this.renderChildren([]) : undefined;
    }
    handleHelper(command, ...args) {
        if (!this.isValid()) {
            return '';
        }
        if (GET_RESULT_ACTIONS.indexOf(command) !== -1) {
            return Reflect.apply(this.controller[this.property][command], this.controller[this.property], Array.from(arguments).slice(1, arguments.length));
        }
        if (arguments.length === 2) {
            return this.controller[this.property].get(command);
        }
        return this.controller[this.property].get(arguments[1]);
    }
    run(command, ...args) {
        if (this.isBlockHelper()) {
            return this.handleBlockHelper(command);
        }
        return this.handleHelper(command, ...args);
    }
}
RequestDataReaderHandlebarsHelper.className = 'Najs.RequestDataReaderHandlebarsHelper';
exports.RequestDataReaderHandlebarsHelper = RequestDataReaderHandlebarsHelper;
najs_binding_1.register(RequestDataReaderHandlebarsHelper);
