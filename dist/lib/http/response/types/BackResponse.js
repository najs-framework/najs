"use strict";
/// <reference path="../../../contracts/HttpDriver.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../../constants");
class BackResponse {
    constructor(defaultUrl = '/') {
        this.defaultUrl = defaultUrl;
    }
    getClassName() {
        return constants_1.ResponseTypeClass.Back;
    }
    respond(request, response, driver) {
        let url = request.header('Referer');
        if (!url) {
            url = this.defaultUrl;
        }
        return driver.respondRedirect(response, url, 302);
    }
}
BackResponse.className = constants_1.ResponseTypeClass.Back;
exports.BackResponse = BackResponse;
najs_binding_1.register(BackResponse);
