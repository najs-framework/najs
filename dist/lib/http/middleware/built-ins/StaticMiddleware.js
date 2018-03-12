"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressMiddlewareBase_1 = require("../ExpressMiddlewareBase");
const najs_binding_1 = require("najs-binding");
const PathFacade_1 = require("../../../facades/global/PathFacade");
const Express = require("express");
class StaticMiddleware extends ExpressMiddlewareBase_1.ExpressMiddlewareBase {
    getClassName() {
        return StaticMiddleware.className;
    }
    // The format of this middleware looks like
    //  - static:~/public:/
    //  - static:~/css:/css
    parseParams(name, directory, publicPath) {
        if (directory) {
            this.directory = PathFacade_1.Path.cwd(directory.indexOf('~/') === 0 ? directory.substr(2) : directory);
        }
        else {
            this.directory = PathFacade_1.Path.public();
        }
        this.publicPath = publicPath || '/';
    }
    createMiddleware() {
        return Express.static(this.directory);
    }
    native(driver) {
        driver.getNativeDriver().use(this.publicPath, this.createMiddleware());
        return undefined;
    }
}
StaticMiddleware.className = 'Najs.StaticMiddleware';
exports.StaticMiddleware = StaticMiddleware;
najs_binding_1.register(StaticMiddleware);
