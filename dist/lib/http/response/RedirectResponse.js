"use strict";
/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/Response.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
class RedirectResponse {
    constructor(url, status = 302) {
        this.url = url;
        this.status = status;
    }
    getClassName() {
        return constants_1.Najs.Http.Response.RedirectResponse;
    }
    respond(request, response, driver) {
        return driver.respondRedirect(response, this.url, this.status);
    }
}
RedirectResponse.className = constants_1.Najs.Http.Response.RedirectResponse;
exports.RedirectResponse = RedirectResponse;
najs_binding_1.register(RedirectResponse, constants_1.Najs.Http.Response.RedirectResponse);
