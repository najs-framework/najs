"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = require("../../../core/register");
const constants_1 = require("../../../constants");
class ViewResponse {
    constructor(view, variables) {
        this.view = view;
        this.variables = variables || {};
    }
    getClassName() {
        return constants_1.ResponseTypeClass.View;
    }
    respond(request, response, driver) {
        return driver.respondView(response, this.view, this.variables);
    }
    with(name, value) {
        this.variables[name] = value;
        return this;
    }
    getVariables() {
        return this.variables;
    }
}
ViewResponse.className = constants_1.ResponseTypeClass.View;
exports.ViewResponse = ViewResponse;
register_1.register(ViewResponse);
