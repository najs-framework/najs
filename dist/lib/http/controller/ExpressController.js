"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogFacade_1 = require("./../../facades/global/LogFacade");
const MemberProxy_1 = require("./MemberProxy");
const Controller_1 = require("./Controller");
const RequestDataReader_1 = require("../request/RequestDataReader");
const InputContextualFacade_1 = require("../../facades/contextual/InputContextualFacade");
const SessionWarningMessage = 'Please use SessionMiddleware if you are using this.session.{{key}}() in controller';
const SessionProxySetting = {
    get(path, defaultValue) {
        LogFacade_1.Log.warning(SessionWarningMessage.replace('{{key}}', 'get'));
        return defaultValue;
    },
    chainable: ['set', 'put', 'push', 'pull', 'delete', 'remove', 'forget', 'clear', 'flush', 'flash', 'reflash', 'keep'],
    returnFalse: ['has', 'exists'],
    returnEmptyObject: ['all', 'only', 'except'],
    returnPromiseUndefined: ['regenerate']
};
class ExpressController extends Controller_1.Controller {
    constructor(request, response) {
        super(request, response);
        this.body = new RequestDataReader_1.RequestDataReader(request.body || {});
        this.params = new RequestDataReader_1.RequestDataReader(request.params || {});
        this.query = new RequestDataReader_1.RequestDataReader(request.query || {});
        this.input = InputContextualFacade_1.Input.of(this);
        this.session = new MemberProxy_1.MemberProxy(SessionWarningMessage, SessionProxySetting);
        this.__autoloadMetadata = {
            requestId: request['id']
        };
    }
}
exports.ExpressController = ExpressController;
