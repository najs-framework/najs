"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContextualFacade_1 = require("../../facades/ContextualFacade");
const RequestData_1 = require("./RequestData");
const HttpMethod_1 = require("../HttpMethod");
class Input extends ContextualFacade_1.ContextualFacade {
    constructor(controller) {
        super(controller);
        controller.input = this;
        this.body = controller.request.body;
        this.query = controller.request.query;
        this.params = controller.request.params;
        this.method = controller.request.method.toUpperCase();
    }
    buildData() {
        switch (this.method) {
            case HttpMethod_1.HttpMethod.GET:
                this.data = Object.assign({}, this.query, this.params);
                break;
            case HttpMethod_1.HttpMethod.PATCH:
            case HttpMethod_1.HttpMethod.PUT:
            case HttpMethod_1.HttpMethod.POST:
            case HttpMethod_1.HttpMethod.PURGE:
            case HttpMethod_1.HttpMethod.DELETE:
                this.data = Object.assign({}, this.params, this.body);
                break;
            default:
                this.data = Object.assign({}, this.query, this.params, this.body);
                break;
        }
    }
    setData(data) {
        this.data = data;
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
exports.Input = Input;
