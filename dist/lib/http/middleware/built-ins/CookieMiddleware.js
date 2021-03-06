"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const ExpressMiddlewareBase_1 = require("../ExpressMiddlewareBase");
const CookieHandlebarsHelper_1 = require("../../../view/handlebars/helpers/CookieHandlebarsHelper");
const CookieContextualFacade_1 = require("../../../facades/contextual/CookieContextualFacade");
const ConfigFacade_1 = require("../../../facades/global/ConfigFacade");
const constants_1 = require("../../../constants");
const CookieParserNative = require("cookie-parser");
class CookieMiddleware extends ExpressMiddlewareBase_1.ExpressMiddlewareBase {
    getClassName() {
        return CookieMiddleware.className;
    }
    parseIdentify(...args) {
        return 'cookie-parser';
    }
    createMiddleware() {
        if (!exports.CookieParser) {
            exports.CookieParser = CookieParserNative(this.getSecret(), this.getOptions());
        }
        return exports.CookieParser;
    }
    getSecret() {
        return ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Cookie.secret, 'najs');
    }
    getOptions() {
        return ConfigFacade_1.ConfigFacade.get(constants_1.ConfigurationKeys.Cookie.options, {});
    }
    async before(request, response, controller) {
        CookieContextualFacade_1.CookieContextualFacade.of(controller);
    }
    async after(request, response, result, controller) {
        return this.defineHandlebarsHelperIfNeeded(result, 'Cookie', CookieHandlebarsHelper_1.CookieHandlebarsHelper, controller);
    }
}
CookieMiddleware.className = 'Najs.CookieMiddleware';
exports.CookieMiddleware = CookieMiddleware;
najs_binding_1.register(CookieMiddleware);
