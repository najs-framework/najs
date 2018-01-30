"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonResponse_1 = require("./types/JsonResponse");
const JsonpResponse_1 = require("./types/JsonpResponse");
const RedirectResponse_1 = require("./types/RedirectResponse");
class Response {
    json(value) {
        return new JsonResponse_1.JsonResponse(value);
    }
    jsonp(value) {
        return new JsonpResponse_1.JsonpResponse(value);
    }
    redirect(url, status = 302) {
        return new RedirectResponse_1.RedirectResponse(url, status);
    }
}
exports.ResponseFacade = new Response();
