"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../http/cookie/Cookie");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../constants");
const facade = najs_facade_1.Facade.create(function (context) {
    if (!context.cookie) {
        return najs_binding_1.make(constants_1.ContextualFacadeClass.Cookie, [context]);
    }
    return context.cookie;
});
exports.Cookie = facade;
exports.CookieContextualFacade = facade;
