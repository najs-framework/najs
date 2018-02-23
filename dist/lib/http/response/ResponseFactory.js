"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_1 = require("./../../core/make");
const Facade_1 = require("./../../facades/Facade");
const constants_1 = require("../../constants");
const register_1 = require("../../core/register");
class ResponseFactory extends Facade_1.Facade {
    getClassName() {
        return constants_1.GlobalFacadeClass.Response;
    }
    view(view, variables) {
        return make_1.make(constants_1.ResponseTypeClass.View, [view, variables]);
    }
    json(value) {
        return make_1.make(constants_1.ResponseTypeClass.Json, [value]);
    }
    jsonp(value) {
        return make_1.make(constants_1.ResponseTypeClass.Jsonp, [value]);
    }
    redirect(url, status = 302) {
        return make_1.make(constants_1.ResponseTypeClass.Redirect, [url, status]);
    }
    back(defaultUrl) {
        return make_1.make(constants_1.ResponseTypeClass.Back, [defaultUrl]);
    }
}
ResponseFactory.className = constants_1.GlobalFacadeClass.Response;
exports.ResponseFactory = ResponseFactory;
register_1.register(ResponseFactory);
