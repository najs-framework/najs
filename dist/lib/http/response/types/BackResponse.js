"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BackResponse {
    constructor(defaultUrl = '/') {
        this.defaultUrl = defaultUrl;
    }
    respond(request, response, driver) {
        let url = request.header('Referer');
        if (!url) {
            url = this.defaultUrl;
        }
        return driver.respondRedirect(response, url, 302);
    }
}
exports.BackResponse = BackResponse;
