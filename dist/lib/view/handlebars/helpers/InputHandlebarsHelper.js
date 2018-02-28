"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HandlebarsHelper_1 = require("../HandlebarsHelper");
class InputHandlebarsHelper extends HandlebarsHelper_1.HandlebarsHelper {
    getClassName() {
        return InputHandlebarsHelper.className;
    }
    run(command, ...args) {
        const isBlockHelper = this.isBlockHelper();
        if (!this.controller || !this.controller.input) {
            return isBlockHelper ? undefined : '';
        }
        // if this is block helper, it's perform "has" function
        if (isBlockHelper) {
            return this.controller.input.has(command) ? this.renderChildren([]) : undefined;
        }
        switch (command.toLowerCase()) {
            case 'except':
            case 'only':
                Reflect.apply(this.controller.input[command], this.controller.input, Array.from(arguments).slice(1, arguments.length));
                return undefined;
            case 'has':
            case 'all':
                return Reflect.apply(this.controller.input[command], this.controller.input, Array.from(arguments).slice(1, arguments.length));
            default:
                if (arguments.length === 2) {
                    return this.controller.input.get(command);
                }
                return this.controller.input.get(arguments[1]);
        }
    }
}
InputHandlebarsHelper.className = 'Najs.InputHandlebarsHelper';
exports.InputHandlebarsHelper = InputHandlebarsHelper;
