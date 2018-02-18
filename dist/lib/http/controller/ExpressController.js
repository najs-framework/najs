"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./Controller");
const RequestData_1 = require("../request/RequestData");
const InputContextualFacade_1 = require("../../facades/contextual/InputContextualFacade");
class ExpressController extends Controller_1.Controller {
    constructor(request, response) {
        super(request, response);
        this.body = new RequestData_1.RequestData(request.body || {});
        this.params = new RequestData_1.RequestData(request.params || {});
        this.query = new RequestData_1.RequestData(request.query || {});
        this.input = InputContextualFacade_1.Input.of(this);
        this.__autoloadMetadata = {
            requestId: request['id']
        };
    }
}
exports.ExpressController = ExpressController;
