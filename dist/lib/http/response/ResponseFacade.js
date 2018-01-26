"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsonResponse_1 = require("./types/JsonResponse");
const RedirectResponse_1 = require("./types/RedirectResponse");
class ResponseFacade {
    json(value) {
        return new JsonResponse_1.JsonResponse(value);
    }
    redirect(url, status = 302) {
        return new RedirectResponse_1.RedirectResponse(url, status);
    }
}
exports.Response = new ResponseFacade();
