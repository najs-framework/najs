"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonResponse = /** @class */ (function () {
    function JsonResponse(value) {
        this.value = value;
    }
    JsonResponse.prototype.respond = function (response, driver) {
        return driver.respondJson(response, this.value);
    };
    return JsonResponse;
}());
exports.JsonResponse = JsonResponse;
//# sourceMappingURL=JsonResponse.js.map