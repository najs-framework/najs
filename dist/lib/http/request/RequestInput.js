"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const ExpressController_1 = require("../controller/ExpressController");
const najs_facade_1 = require("najs-facade");
const constants_1 = require("../../constants");
const RequestDataReader_1 = require("./RequestDataReader");
const HttpMethod_1 = require("../HttpMethod");
class RequestInput extends najs_facade_1.ContextualFacade {
    constructor(controller) {
        super(controller);
        controller.input = this;
        if (controller instanceof ExpressController_1.ExpressController) {
            this.createInputFromExpressController();
        }
    }
    getClassName() {
        return constants_1.ContextualFacadeClass.Input;
    }
    createInputFromExpressController() {
        const request = this.context.request;
        switch (request.method.toUpperCase()) {
            case HttpMethod_1.HttpMethod.GET:
                this.data = Object.assign({}, request.query, request.params);
                break;
            case HttpMethod_1.HttpMethod.PATCH:
            case HttpMethod_1.HttpMethod.PUT:
            case HttpMethod_1.HttpMethod.POST:
            case HttpMethod_1.HttpMethod.PURGE:
            case HttpMethod_1.HttpMethod.DELETE:
                this.data = Object.assign({}, request.params, request.body);
                break;
            default:
                this.data = Object.assign({}, request.query, request.params, request.body);
                break;
        }
    }
    get(name, defaultValue) {
        return RequestDataReader_1.RequestDataReader.prototype.get.apply(this, arguments);
    }
    has(name) {
        return RequestDataReader_1.RequestDataReader.prototype.has.apply(this, arguments);
    }
    exists(name) {
        return RequestDataReader_1.RequestDataReader.prototype.exists.apply(this, arguments);
    }
    all() {
        return RequestDataReader_1.RequestDataReader.prototype.all.apply(this, arguments);
    }
    only(...args) {
        return RequestDataReader_1.RequestDataReader.prototype.only.apply(this, arguments);
    }
    except(...args) {
        return RequestDataReader_1.RequestDataReader.prototype.except.apply(this, arguments);
    }
}
exports.RequestInput = RequestInput;
najs_binding_1.register(RequestInput);
