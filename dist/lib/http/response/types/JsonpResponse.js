"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("../../../core/register");
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
register_1.register(JsonpResponse);
