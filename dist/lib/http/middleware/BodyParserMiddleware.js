"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const BodyParser = require("body-parser");
class BodyParserMiddleware {
    constructor() {
        if (!exports.JsonParser) {
            exports.JsonParser = BodyParser.json();
        }
        if (!exports.UrlEncodedParser) {
            exports.UrlEncodedParser = BodyParser.urlencoded(this.getUrlEncodedOptions());
        }
    }
    getUrlEncodedOptions() {
        return { extended: true };
    }
    before(request, response) {
        return new Promise(function (resolve, reject) {
            exports.JsonParser(request, response, function (error) {
                if (error) {
                    return reject(error);
                }
                exports.UrlEncodedParser(request, response, function (error) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            });
        });
    }
}
BodyParserMiddleware.className = 'Najs.BodyParserMiddleware';
exports.BodyParserMiddleware = BodyParserMiddleware;
najs_binding_1.register(BodyParserMiddleware);
