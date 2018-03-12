"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const ExpressMiddlewareBase_1 = require("../ExpressMiddlewareBase");
const BodyParser = require("body-parser");
const HandlebarsHelper_1 = require("../../../view/handlebars/HandlebarsHelper");
const RequestDataReaderHandlebarsHelper_1 = require("../../../view/handlebars/helpers/RequestDataReaderHandlebarsHelper");
const HandlebarsViewResponse_1 = require("../../../view/handlebars/HandlebarsViewResponse");
class BodyParserMiddleware extends ExpressMiddlewareBase_1.ExpressMiddlewareBase {
    getClassName() {
        return BodyParserMiddleware.className;
    }
    parseParams(name, ...loaders) {
        this.useJson = false;
        this.useUrlEncoded = false;
        this.useRaw = false;
        this.useText = false;
        if (loaders.length === 0) {
            this.useJson = true;
            this.useUrlEncoded = true;
        }
        this.mapUsedLoaders(loaders);
    }
    mapUsedLoaders(loaders) {
        for (const name of loaders) {
            switch (name.toLocaleLowerCase()) {
                case 'json':
                    this.useJson = true;
                    break;
                case 'raw':
                    this.useRaw = true;
                    break;
                case 'urlencoded':
                    this.useUrlEncoded = true;
                    break;
                case 'text':
                    this.useText = true;
            }
        }
    }
    getJsonOptions() {
        return undefined;
    }
    getRawOptions() {
        return undefined;
    }
    getTextOptions() {
        return undefined;
    }
    getUrlEncodedOptions() {
        return { extended: true };
    }
    createMiddleware() {
        const result = [];
        if (this.useRaw) {
            result.push(BodyParser.raw(this.getRawOptions()));
        }
        if (this.useText) {
            result.push(BodyParser.text(this.getTextOptions()));
        }
        if (this.useJson) {
            result.push(BodyParser.json(this.getJsonOptions()));
        }
        if (this.useUrlEncoded) {
            result.push(BodyParser.urlencoded(this.getUrlEncodedOptions()));
        }
        return result.length > 0 ? result : undefined;
    }
    async after(request, response, result, controller) {
        if (result instanceof HandlebarsViewResponse_1.HandlebarsViewResponse) {
            result.helper('Input', HandlebarsHelper_1.HandlebarsHelper.create(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, controller, 'input'));
            result.helper('Body', HandlebarsHelper_1.HandlebarsHelper.create(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, controller, 'body'));
            result.helper('Query', HandlebarsHelper_1.HandlebarsHelper.create(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, controller, 'query'));
            result.helper('Params', HandlebarsHelper_1.HandlebarsHelper.create(RequestDataReaderHandlebarsHelper_1.RequestDataReaderHandlebarsHelper, controller, 'params'));
        }
        return result;
    }
}
BodyParserMiddleware.className = 'Najs.BodyParserMiddleware';
exports.BodyParserMiddleware = BodyParserMiddleware;
najs_binding_1.register(BodyParserMiddleware);
