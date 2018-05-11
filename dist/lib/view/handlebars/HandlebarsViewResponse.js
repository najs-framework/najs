"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const ViewResponse_1 = require("../../http/response/ViewResponse");
class HandlebarsViewResponse extends ViewResponse_1.ViewResponse {
    getClassName() {
        return constants_1.Najs.Http.Response.HandlebarsViewResponse;
    }
    helper(arg, fn) {
        if (Array.isArray(arg)) {
            for (const name of arg) {
                this.with(`helpers.${name}`, fn);
            }
        }
        else {
            this.with(`helpers.${arg}`, fn);
        }
        return this;
    }
}
HandlebarsViewResponse.className = constants_1.Najs.Http.Response.HandlebarsViewResponse;
exports.HandlebarsViewResponse = HandlebarsViewResponse;
najs_binding_1.register(HandlebarsViewResponse, constants_1.Najs.Http.Response.HandlebarsViewResponse);
