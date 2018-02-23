"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Facade_1 = require("./../../facades/Facade");
const constants_1 = require("../../constants");
const ViewResponse_1 = require("./types/ViewResponse");
const JsonResponse_1 = require("./types/JsonResponse");
const JsonpResponse_1 = require("./types/JsonpResponse");
const RedirectResponse_1 = require("./types/RedirectResponse");
const BackResponse_1 = require("./types/BackResponse");
const register_1 = require("../../core/register");
class ResponseFactory extends Facade_1.Facade {
    getClassName() {
        return constants_1.GlobalFacadeClass.Response;
    }
    view(view, variables) {
        return new ViewResponse_1.ViewResponse(view, variables);
    }
    json(value) {
        return new JsonResponse_1.JsonResponse(value);
    }
    jsonp(value) {
        return new JsonpResponse_1.JsonpResponse(value);
    }
    redirect(url, status = 302) {
        return new RedirectResponse_1.RedirectResponse(url, status);
    }
    back(defaultUrl) {
        return new BackResponse_1.BackResponse(defaultUrl);
    }
}
ResponseFactory.className = constants_1.GlobalFacadeClass.Response;
exports.ResponseFactory = ResponseFactory;
register_1.register(ResponseFactory);
