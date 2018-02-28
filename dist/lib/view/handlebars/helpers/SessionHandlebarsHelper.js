"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HandlebarsHelper_1 = require("../HandlebarsHelper");
class SessionHandlebarsHelper extends HandlebarsHelper_1.HandlebarsHelper {
    getClassName() {
        return SessionHandlebarsHelper.className;
    }
    run(command, ...args) {
        const isBlockHelper = this.isBlockHelper();
        if (!this.controller || !this.controller.session) {
            return isBlockHelper ? undefined : '';
        }
        // if this is block helper, it's perform "has" function
        if (isBlockHelper) {
            return this.controller.session.has(command) ? this.renderChildren([]) : undefined;
        }
        switch (command.toLowerCase()) {
            case 'reflash':
            case 'keep':
            case 'flash':
            case 'clear':
            case 'flush':
            case 'delete':
            case 'remove':
            case 'forget':
            case 'set':
            case 'put':
            case 'push':
            case 'except':
            case 'only':
                Reflect.apply(this.controller.session[command], this.controller.session, Array.from(arguments).slice(1, arguments.length));
                return undefined;
            case 'has':
            case 'exists':
            case 'pull':
            case 'all':
                return Reflect.apply(this.controller.session[command], this.controller.session, Array.from(arguments).slice(1, arguments.length));
            default:
                if (arguments.length === 2) {
                    return this.controller.session.get(command);
                }
                return this.controller.session.get(arguments[1]);
        }
    }
}
SessionHandlebarsHelper.className = 'Najs.SessionHandlebarsHelper';
exports.SessionHandlebarsHelper = SessionHandlebarsHelper;
