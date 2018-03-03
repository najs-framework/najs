"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../auth/AuthManager");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../constants");
const facade = najs_facade_1.Facade.create(function (context) {
    if (!context.auth) {
        return najs_binding_1.make(constants_1.ContextualFacadeClass.Auth, [context]);
    }
    return context.auth;
});
exports.Auth = facade;
exports.AuthContextualFacade = facade;
