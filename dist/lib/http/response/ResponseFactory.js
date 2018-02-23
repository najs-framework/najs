"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const Facade_1 = require("./../../facades/Facade");
const constants_1 = require("../../constants");
class ResponseFactory extends Facade_1.Facade {
    getClassName() {
        return constants_1.GlobalFacadeClass.Response;
    }
    view(view, variables) {
        return najs_binding_1.make(constants_1.ResponseTypeClass.View, [view, variables]);
    }
    json(value) {
        return najs_binding_1.make(constants_1.ResponseTypeClass.Json, [value]);
    }
    jsonp(value) {
        return najs_binding_1.make(constants_1.ResponseTypeClass.Jsonp, [value]);
    }
    redirect(url, status = 302) {
        return najs_binding_1.make(constants_1.ResponseTypeClass.Redirect, [url, status]);
    }
    back(defaultUrl) {
        return najs_binding_1.make(constants_1.ResponseTypeClass.Back, [defaultUrl]);
    }
}
ResponseFactory.className = constants_1.GlobalFacadeClass.Response;
exports.ResponseFactory = ResponseFactory;
najs_binding_1.register(ResponseFactory);
