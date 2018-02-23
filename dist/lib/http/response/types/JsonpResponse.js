"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../../constants");
class JsonpResponse {
    constructor(value) {
        this.value = value;
    }
    getClassName() {
        return constants_1.ResponseTypeClass.Jsonp;
    }
    respond(request, response, driver) {
        return driver.respondJsonp(response, this.value);
    }
}
JsonpResponse.className = constants_1.ResponseTypeClass.Jsonp;
exports.JsonpResponse = JsonpResponse;
najs_binding_1.register(JsonpResponse);
