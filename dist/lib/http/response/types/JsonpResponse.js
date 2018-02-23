"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonpResponse {
    constructor(value) {
        this.value = value;
    }
    respond(request, response, driver) {
        return driver.respondJsonp(response, this.value);
    }
}
exports.JsonpResponse = JsonpResponse;
