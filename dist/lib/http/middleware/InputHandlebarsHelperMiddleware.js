"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BodyParserMiddleware_1 = require("./BodyParserMiddleware");
const najs_binding_1 = require("najs-binding");
const HandlebarsViewResponse_1 = require("../../view/handlebars/HandlebarsViewResponse");
const HandlebarsHelper_1 = require("../../view/handlebars/HandlebarsHelper");
const RequestDataReaderHandlebarsHelper_1 = require("../../view/handlebars/helpers/RequestDataReaderHandlebarsHelper");
class InputHandlebarsHelperMiddleware extends BodyParserMiddleware_1.BodyParserMiddleware {
    async after(request, response, result, controller) {
        if (result instanceof HandlebarsViewResponse_1.HandlebarsViewResponse) {
            result.helper('Input', HandlebarsHelper_1.HandlebarsHelper.create(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, controller, 'input'));
        }
        return result;
    }
}
InputHandlebarsHelperMiddleware.className = 'Najs.InputHandlebarsHelperMiddleware';
exports.InputHandlebarsHelperMiddleware = InputHandlebarsHelperMiddleware;
najs_binding_1.register(InputHandlebarsHelperMiddleware);
