"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../constants");
const najs_facade_1 = require("najs-facade");
const ExpressController_1 = require("../controller/ExpressController");
class Cookie extends najs_facade_1.ContextualFacade {
    constructor(controller) {
        super(controller);
        controller.cookie = this;
        if (controller instanceof ExpressController_1.ExpressController) {
            const request = controller.request;
            this.data = Object.assign({}, request.cookies, request.signedCookies);
            this.cookies = request.cookies;
            this.signedCookies = request.signedCookies;
        }
    }
    getClassName() {
        return constants_1.ContextualFacadeClass.Session;
    }
    getResponse() {
        return this.context.response;
    }
}
exports.Cookie = Cookie;
