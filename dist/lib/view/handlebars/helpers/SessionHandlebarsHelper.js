"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HandlebarsHelper_1 = require("../HandlebarsHelper");
class SessionHandlebarsHelper extends HandlebarsHelper_1.HandlebarsHelper {
    getClassName() {
        return SessionHandlebarsHelper.className;
    }
    isValid() {
        return !this.controller || !this.controller.session ? false : true;
    }
    handleBlockHelper(key) {
        if (!this.isValid()) {
            return undefined;
        }
        return this.controller.session.has(key) ? this.renderChildren([]) : undefined;
    }
    handleHelper(command, ...args) {
        if (!this.isValid()) {
            return '';
        }
        const modifyActions = [
            'reflash',
            'keep',
            'flash',
            'clear',
            'flush',
            'delete',
            'remove',
            'forget',
            'set',
            'put',
            'push'
        ];
        const getResultActions = ['has', 'exists', 'pull', 'all', 'except', 'only'];
        const isGetResultAction = getResultActions.indexOf(command) !== -1;
        if (modifyActions.indexOf(command) !== -1 || isGetResultAction) {
            const result = Reflect.apply(this.controller.session[command], this.controller.session, Array.from(arguments).slice(1, arguments.length));
            return isGetResultAction ? result : undefined;
        }
        if (arguments.length === 2) {
            return this.controller.session.get(command);
        }
        return this.controller.session.get(arguments[1]);
    }
    run(command, ...args) {
        if (this.isBlockHelper()) {
            return this.handleBlockHelper(command);
        }
        return this.handleHelper(command, ...args);
    }
}
SessionHandlebarsHelper.className = 'Najs.SessionHandlebarsHelper';
exports.SessionHandlebarsHelper = SessionHandlebarsHelper;
najs_binding_1.register(SessionHandlebarsHelper);
