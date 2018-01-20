"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonResponse {
    constructor(value) {
        this.value = value;
    }
    respond(response, driver) {
        return driver.respondJson(response, this.value);
    }
}
exports.JsonResponse = JsonResponse;
