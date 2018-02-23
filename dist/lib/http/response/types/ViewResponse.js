"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ViewResponse {
    constructor(view, variables) {
        this.view = view;
        this.variables = variables || {};
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
exports.ViewResponse = ViewResponse;
