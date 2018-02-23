"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../../constants");
class JsonResponse {
    constructor(value) {
        this.value = value;
    }
    getClassName() {
        return constants_1.ResponseTypeClass.Json;
    }
    respond(request, response, driver) {
        return driver.respondJson(response, this.value);
    }
}
JsonResponse.className = constants_1.ResponseTypeClass.Json;
exports.JsonResponse = JsonResponse;
najs_binding_1.register(JsonResponse);
