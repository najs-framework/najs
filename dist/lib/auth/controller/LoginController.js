"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../http/response/RedirectResponse");
const constants_1 = require("../../constants");
const ExpressController_1 = require("../../http/controller/ExpressController");
const ConfigFacade_1 = require("../../facades/global/ConfigFacade");
const ResponseFacade_1 = require("../../facades/global/ResponseFacade");
class LoginController extends ExpressController_1.ExpressController {
    getClassName() {
        return constants_1.AuthClass.LoginController;
    }
    getUrl(key) {
        return ConfigFacade_1.Config.get(`${constants_1.ConfigurationKeys.Auth.url}.${key}`);
    }
    async login() {
        if (!this.auth.check()) {
            const attemptSuccess = await this.auth.attempt(this.input.all(), this.input.get('remember', false));
            if (!attemptSuccess) {
                return ResponseFacade_1.Response.redirect(this.getUrl('loginFailure'));
            }
        }
        return ResponseFacade_1.Response.redirect(this.getUrl('loginSuccess'));
    }
    async logout() {
        if (this.auth.check()) {
            await this.auth.logout();
        }
        return ResponseFacade_1.Response.redirect(this.getUrl('logoutRedirect'));
    }
}
exports.LoginController = LoginController;
