"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const ExpressController_1 = require("../controller/ExpressController");
const ContextualFacade_1 = require("../../facades/ContextualFacade");
const constants_1 = require("../../constants");
const RequestData_1 = require("./RequestData");
const HttpMethod_1 = require("../HttpMethod");
class RequestInput extends ContextualFacade_1.ContextualFacade {
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
        return RequestData_1.RequestData.prototype.get.apply(this, arguments);
    }
    has(name) {
        return RequestData_1.RequestData.prototype.has.apply(this, arguments);
    }
    all() {
        return RequestData_1.RequestData.prototype.all.apply(this, arguments);
    }
    only(...args) {
        return RequestData_1.RequestData.prototype.only.apply(this, arguments);
    }
    except(...args) {
        return RequestData_1.RequestData.prototype.except.apply(this, arguments);
    }
}
exports.RequestInput = RequestInput;
najs_binding_1.register(RequestInput);
