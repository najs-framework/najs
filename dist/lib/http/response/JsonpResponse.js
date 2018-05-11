"use strict";
/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/Response.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
class JsonpResponse {
    constructor(value) {
        this.value = value;
    }
    getClassName() {
        return constants_1.Najs.Http.Response.JsonpResponse;
    }
    respond(request, response, driver) {
        return driver.respondJsonp(response, this.value);
    }
}
JsonpResponse.className = constants_1.Najs.Http.Response.JsonpResponse;
exports.JsonpResponse = JsonpResponse;
najs_binding_1.register(JsonpResponse, constants_1.Najs.Http.Response.JsonpResponse);
