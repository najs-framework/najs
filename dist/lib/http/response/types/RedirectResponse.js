"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("../../../core/register");
const constants_1 = require("../../../constants");
class RedirectResponse {
    constructor(url, status = 302) {
        this.url = url;
        this.status = status;
    }
    getClassName() {
        return constants_1.ResponseTypeClass.Redirect;
    }
    respond(request, response, driver) {
        return driver.respondRedirect(response, this.url, this.status);
    }
}
RedirectResponse.className = constants_1.ResponseTypeClass.Redirect;
exports.RedirectResponse = RedirectResponse;
register_1.register(RedirectResponse);
