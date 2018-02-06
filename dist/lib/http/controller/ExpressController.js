"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./Controller");
const HttpMethod_1 = require("../HttpMethod");
const RequestData_1 = require("../request/RequestData");
class ExpressController extends Controller_1.Controller {
    constructor(request, response) {
        super(request, response);
        this.body = new RequestData_1.RequestData(request.body || {});
        this.params = new RequestData_1.RequestData(request.params || {});
        this.query = new RequestData_1.RequestData(request.query || {});
        this.createInputFromRequest();
    }
    createInputFromRequest() {
        let data;
        switch (this.request.method.toUpperCase()) {
            case HttpMethod_1.HttpMethod.GET:
                data = Object.assign({}, this.request.query, this.request.params);
                break;
            case HttpMethod_1.HttpMethod.PATCH:
            case HttpMethod_1.HttpMethod.PUT:
            case HttpMethod_1.HttpMethod.POST:
            case HttpMethod_1.HttpMethod.PURGE:
            case HttpMethod_1.HttpMethod.DELETE:
                data = Object.assign({}, this.request.params, this.request.body);
                break;
            default:
                data = Object.assign({}, this.request.query, this.request.params, this.request.body);
                break;
        }
        this.input = new RequestData_1.RequestData(data);
        return this.input;
    }
}
exports.ExpressController = ExpressController;
