"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogFacade_1 = require("./../../facades/global/LogFacade");
const MemberProxy_1 = require("./MemberProxy");
const Controller_1 = require("./Controller");
const RequestDataReader_1 = require("../request/RequestDataReader");
const InputContextualFacade_1 = require("../../facades/contextual/InputContextualFacade");
const CookieContextualFacade_1 = require("../../facades/contextual/CookieContextualFacade");
const SessionContextualFacade_1 = require("./../../facades/contextual/SessionContextualFacade");
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
const CookieWarningMessage = 'Please use CookieMiddleware if you are using this.cookie.{{key}}() in controller';
const CookieProxySetting = {
    get(path, defaultValue) {
        LogFacade_1.Log.warning(CookieWarningMessage.replace('{{key}}', 'get'));
        return defaultValue;
    },
    chainable: ['forget', 'make', 'forever'],
    returnFalse: ['isSigned', 'has', 'exists'],
    returnEmptyObject: ['all', 'only', 'except']
};
class ExpressController extends Controller_1.Controller {
    constructor(request, response) {
        super(request, response);
        this.body = new RequestDataReader_1.RequestDataReader(request.body || {});
        this.params = new RequestDataReader_1.RequestDataReader(request.params || {});
        this.query = new RequestDataReader_1.RequestDataReader(request.query || {});
        this.input = InputContextualFacade_1.Input.of(this);
        if (this.request.session) {
            this.session = SessionContextualFacade_1.SessionContextualFacade.of(this);
        }
        else {
            this.session = new MemberProxy_1.MemberProxy(SessionWarningMessage, SessionProxySetting);
        }
        if (this.request.cookies || this.request.signedCookies) {
            this.cookie = CookieContextualFacade_1.CookieContextualFacade.of(this);
        }
        else {
            this.cookie = new MemberProxy_1.MemberProxy(CookieWarningMessage, CookieProxySetting);
        }
        this.__autoloadMetadata = {
            requestId: request['id']
        };
    }
}
exports.ExpressController = ExpressController;
