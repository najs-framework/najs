"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RedirectResponse = /** @class */ (function () {
    function RedirectResponse(url, status) {
        if (status === void 0) { status = 302; }
        this.url = url;
        this.status = status;
    }
    RedirectResponse.prototype.respond = function (response, driver) {
        return driver.respondRedirect(response, this.url, this.status);
    };
    return RedirectResponse;
}());
exports.RedirectResponse = RedirectResponse;
//# sourceMappingURL=RedirectResponse.js.map