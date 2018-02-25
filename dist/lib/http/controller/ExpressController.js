"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./Controller");
const RequestDataReader_1 = require("../request/RequestDataReader");
const InputContextualFacade_1 = require("../../facades/contextual/InputContextualFacade");
const SessionContextualFacade_1 = require("../../facades/contextual/SessionContextualFacade");
class ExpressController extends Controller_1.Controller {
    constructor(request, response) {
        super(request, response);
        this.body = new RequestDataReader_1.RequestDataReader(request.body || {});
        this.params = new RequestDataReader_1.RequestDataReader(request.params || {});
        this.query = new RequestDataReader_1.RequestDataReader(request.query || {});
        this.input = InputContextualFacade_1.Input.of(this);
        this.session = SessionContextualFacade_1.Session.of(this);
        this.__autoloadMetadata = {
            requestId: request['id']
        };
    }
}
exports.ExpressController = ExpressController;
