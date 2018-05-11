"use strict";
/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/Response.ts" />
/// <reference path="../../contracts/types/http.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
class BackResponse {
    constructor(defaultUrl = '/') {
        this.defaultUrl = defaultUrl;
    }
    getClassName() {
        return constants_1.Najs.Http.Response.BackResponse;
    }
    respond(request, response, driver) {
        let url = request.header('Referer');
        if (!url) {
            url = this.defaultUrl;
        }
        return driver.respondRedirect(response, url, 302);
    }
}
BackResponse.className = constants_1.Najs.Http.Response.BackResponse;
exports.BackResponse = BackResponse;
najs_binding_1.register(BackResponse, constants_1.Najs.Http.Response.BackResponse);
