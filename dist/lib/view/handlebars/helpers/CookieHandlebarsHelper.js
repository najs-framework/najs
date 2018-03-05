"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HandlebarsHelper_1 = require("../HandlebarsHelper");
class CookieHandlebarsHelper extends HandlebarsHelper_1.HandlebarsHelper {
    getClassName() {
        return CookieHandlebarsHelper.className;
    }
    isValid() {
        return !this.controller || !this.controller.cookie ? false : true;
    }
    handleBlockHelper(key) {
        if (!this.isValid()) {
            return undefined;
        }
        return this.controller.cookie.has(key) ? this.renderChildren([]) : undefined;
    }
    handleHelper(command, ...args) {
        if (!this.isValid()) {
            return '';
        }
        const getResultActions = ['has', 'exists', 'all', 'except', 'only'];
        if (getResultActions.indexOf(command) !== -1) {
            return Reflect.apply(this.controller.cookie[command], this.controller.cookie, Array.from(arguments).slice(1, arguments.length));
        }
        if (arguments.length === 2) {
            return this.controller.cookie.get(command);
        }
        return this.controller.cookie.get(arguments[1]);
    }
    run(command, ...args) {
        if (this.isBlockHelper()) {
            return this.handleBlockHelper(command);
        }
        return this.handleHelper(command, ...args);
    }
}
CookieHandlebarsHelper.className = 'Najs.CookieHandlebarsHelper';
exports.CookieHandlebarsHelper = CookieHandlebarsHelper;
najs_binding_1.register(CookieHandlebarsHelper);
