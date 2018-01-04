"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonResponse_1 = require("./response-types/JsonResponse");
var RedirectResponse_1 = require("./response-types/RedirectResponse");
var Response = /** @class */ (function () {
    function Response() {
    }
    Response.json = function (value) {
        return new JsonResponse_1.JsonResponse(value);
    };
    Response.redirect = function (url, status) {
        return new RedirectResponse_1.RedirectResponse(url, status);
    };
    return Response;
}());
exports.Response = Response;
//# sourceMappingURL=Response.js.map