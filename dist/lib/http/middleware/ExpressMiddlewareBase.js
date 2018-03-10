"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpressMiddlewareBase {
    constructor(name, level) {
        this.name = name;
        this.parseLevel(level);
        this.parseParams(...arguments);
        this.identify = Array.from(arguments).join(':');
    }
    parseParams(...args) { }
    parseLevel(level) {
        this.isAppLevel = level === 'global' || level === 'app' || level === 'app-level';
    }
    createMiddleware() {
        return undefined;
    }
    native(driver) {
        const middleware = this.createMiddleware();
        if (!middleware || !this.isAppLevel) {
            return middleware;
        }
        // handle app level middleware, always returns undefined
        const app = driver.getNativeDriver();
        if (typeof app['_najsMiddleware'] === 'undefined') {
            app['_najsMiddleware'] = {};
        }
        if (!app['_najsMiddleware'][this.identify]) {
            const handlers = Array.isArray(middleware) ? middleware : [middleware];
            for (const handler in handlers) {
                app.use(handler);
            }
            app['_najsMiddleware'][this.identify] = handlers;
        }
        return undefined;
    }
}
exports.ExpressMiddlewareBase = ExpressMiddlewareBase;
