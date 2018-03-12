"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../session/ExpressSessionMemoryStore");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../../constants");
const najs_binding_2 = require("najs-binding");
const HandlebarsViewResponse_1 = require("../../../view/handlebars/HandlebarsViewResponse");
const HandlebarsHelper_1 = require("../../../view/handlebars/HandlebarsHelper");
const SessionHandlebarsHelper_1 = require("../../../view/handlebars/helpers/SessionHandlebarsHelper");
const ConfigFacade_1 = require("../../../facades/global/ConfigFacade");
const SessionContextualFacade_1 = require("../../../facades/contextual/SessionContextualFacade");
const ExpressMiddlewareBase_1 = require("../ExpressMiddlewareBase");
const ExpressSession = require("express-session");
class SessionMiddleware extends ExpressMiddlewareBase_1.ExpressMiddlewareBase {
    getClassName() {
        return SessionMiddleware.className;
    }
    createMiddleware() {
        if (!exports.Session) {
            exports.Session = ExpressSession(Object.assign({}, { store: this.makeStore() }, this.getOptions()));
        }
        return exports.Session;
    }
    makeStore() {
        return najs_binding_1.make(constants_1.SystemClass.ExpressSessionStore);
    }
    getOptions() {
        return ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Session, {
            secret: 'najs',
            resave: false,
            unset: 'destroy',
            saveUninitialized: true
        });
    }
    before(request, response, controller) {
        SessionContextualFacade_1.SessionContextualFacade.of(controller);
    }
    async after(request, response, result, controller) {
        if (result instanceof HandlebarsViewResponse_1.HandlebarsViewResponse) {
            result.helper('Session', HandlebarsHelper_1.HandlebarsHelper.create(SessionHandlebarsHelper_1.SessionHandlebarsHelper, controller));
        }
        return result;
    }
}
SessionMiddleware.className = 'Najs.SessionMiddleware';
exports.SessionMiddleware = SessionMiddleware;
najs_binding_2.register(SessionMiddleware);
