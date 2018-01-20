"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedirectResponse {
    constructor(url, status = 302) {
        this.url = url;
        this.status = status;
    }
    respond(response, driver) {
        return driver.respondRedirect(response, this.url, this.status);
    }
}
exports.RedirectResponse = RedirectResponse;
