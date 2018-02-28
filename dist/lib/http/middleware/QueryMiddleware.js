"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const HandlebarsViewResponse_1 = require("../../view/handlebars/HandlebarsViewResponse");
const HandlebarsHelper_1 = require("../../view/handlebars/HandlebarsHelper");
const RequestDataReaderHandlebarsHelper_1 = require("../../view/handlebars/helpers/RequestDataReaderHandlebarsHelper");
class QueryMiddleware {
    async after(request, response, result, controller) {
        if (result instanceof HandlebarsViewResponse_1.HandlebarsViewResponse) {
            result.helper('Query', HandlebarsHelper_1.HandlebarsHelper.create(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, controller, 'query'));
        }
        return result;
    }
}
QueryMiddleware.className = 'Najs.QueryMiddleware';
exports.QueryMiddleware = QueryMiddleware;
najs_binding_1.register(QueryMiddleware);
