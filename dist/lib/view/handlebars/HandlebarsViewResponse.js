"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("./../../constants");
const ViewResponse_1 = require("../../http/response/types/ViewResponse");
class HandlebarsViewResponse extends ViewResponse_1.ViewResponse {
    constructor(view, variables) {
        console.log('arguments', arguments);
        super(view, variables);
    }
    getClassName() {
        return constants_1.ResponseTypeClass.HandlebarsView;
    }
    helper(name, fn) {
        this.with(`helpers.${name}`, fn);
    }
}
HandlebarsViewResponse.className = constants_1.ResponseTypeClass.HandlebarsView;
exports.HandlebarsViewResponse = HandlebarsViewResponse;
najs_binding_1.register(HandlebarsViewResponse);
