"use strict";
/// <reference path="../../contracts/Response.ts" />
/// <reference path="../../contracts/ViewResponse.ts" />
/// <reference path="../../contracts/ResponseFactory.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("./BackResponse");
require("./JsonpResponse");
require("./JsonResponse");
require("./RedirectResponse");
require("./ViewResponse");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../constants");
class ResponseFactory extends najs_facade_1.Facade {
    getClassName() {
        return constants_1.Najs.Http.ResponseFactory;
    }
    view(view, variables) {
        return najs_binding_1.make(constants_1.Najs.Http.Response.ViewResponse, [view, variables]);
    }
    json(value) {
        return najs_binding_1.make(constants_1.Najs.Http.Response.JsonResponse, [value]);
    }
    jsonp(value) {
        return najs_binding_1.make(constants_1.Najs.Http.Response.JsonpResponse, [value]);
    }
    redirect(url, status = 302) {
        return najs_binding_1.make(constants_1.Najs.Http.Response.RedirectResponse, [url, status]);
    }
    back(defaultUrl) {
        return najs_binding_1.make(constants_1.Najs.Http.Response.BackResponse, [defaultUrl]);
    }
}
ResponseFactory.className = constants_1.Najs.Http.ResponseFactory;
exports.ResponseFactory = ResponseFactory;
najs_binding_1.register(ResponseFactory, constants_1.Najs.Http.ResponseFactory);
