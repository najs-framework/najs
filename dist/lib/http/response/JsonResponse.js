"use strict";
/// <reference path="../../contracts/HttpDriver.ts" />
/// <reference path="../../contracts/Response.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
class JsonResponse {
    constructor(value) {
        this.value = value;
    }
    getClassName() {
        return constants_1.Najs.Http.Response.JsonResponse;
    }
    respond(request, response, driver) {
        return driver.respondJson(response, this.value);
    }
}
JsonResponse.className = constants_1.Najs.Http.Response.JsonResponse;
exports.JsonResponse = JsonResponse;
najs_binding_1.register(JsonResponse, constants_1.Najs.Http.Response.JsonResponse);
