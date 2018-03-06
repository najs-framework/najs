"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BodyParserMiddleware_1 = require("./BodyParserMiddleware");
const najs_binding_1 = require("najs-binding");
const HandlebarsViewResponse_1 = require("../../view/handlebars/HandlebarsViewResponse");
const HandlebarsHelper_1 = require("../../view/handlebars/HandlebarsHelper");
const RequestDataReaderHandlebarsHelper_1 = require("../../view/handlebars/helpers/RequestDataReaderHandlebarsHelper");
class BodyHandlebarsHelperMiddleware extends BodyParserMiddleware_1.BodyParserMiddleware {
    async after(request, response, result, controller) {
        if (result instanceof HandlebarsViewResponse_1.HandlebarsViewResponse) {
            result.helper('Body', HandlebarsHelper_1.HandlebarsHelper.create(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, controller, 'body'));
        }
        return result;
    }
}
BodyHandlebarsHelperMiddleware.className = 'Najs.BodyHandlebarsHelperMiddleware';
exports.BodyHandlebarsHelperMiddleware = BodyHandlebarsHelperMiddleware;
najs_binding_1.register(BodyHandlebarsHelperMiddleware);
