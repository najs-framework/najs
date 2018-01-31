"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ViewResponse_1 = require("./types/ViewResponse");
const JsonResponse_1 = require("./types/JsonResponse");
const JsonpResponse_1 = require("./types/JsonpResponse");
const RedirectResponse_1 = require("./types/RedirectResponse");
class Response {
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
}
exports.ResponseFacade = new Response();
