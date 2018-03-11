"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../http/session/Session");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../constants");
const MemberProxy_1 = require("../../http/controller/MemberProxy");
const facade = najs_facade_1.Facade.create(function (context) {
    if (!context.session || context.session instanceof MemberProxy_1.MemberProxy) {
        return najs_binding_1.make(constants_1.ContextualFacadeClass.Session, [context]);
    }
    return context.session;
});
exports.Session = facade;
exports.SessionContextualFacade = facade;
