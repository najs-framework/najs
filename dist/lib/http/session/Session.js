"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../../constants");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const RequestDataWriter_1 = require("../request/RequestDataWriter");
const ExpressController_1 = require("../controller/ExpressController");
class Session extends najs_facade_1.ContextualFacade {
    constructor(controller) {
        super(controller);
        controller.session = this;
        if (controller instanceof ExpressController_1.ExpressController) {
            this.data = controller.request.session;
        }
    }
    getClassName() {
        return constants_1.ContextualFacadeClass.Session;
    }
    clear() {
        delete this.data;
        if (this.context instanceof ExpressController_1.ExpressController) {
            delete this.context.request.session;
        }
        return this;
    }
    get(name, defaultValue) {
        return RequestDataWriter_1.RequestDataWriter.prototype.get.apply(this, arguments);
    }
    has(name) {
        return RequestDataWriter_1.RequestDataWriter.prototype.has.apply(this, arguments);
    }
    exists(name) {
        return RequestDataWriter_1.RequestDataWriter.prototype.exists.apply(this, arguments);
    }
    all() {
        return RequestDataWriter_1.RequestDataWriter.prototype.all.apply(this, arguments);
    }
    only(...args) {
        return RequestDataWriter_1.RequestDataWriter.prototype.only.apply(this, arguments);
    }
    except(...args) {
        return RequestDataWriter_1.RequestDataWriter.prototype.except.apply(this, arguments);
    }
    set(path, value) {
        return RequestDataWriter_1.RequestDataWriter.prototype.set.apply(this, arguments);
    }
    put(path, value) {
        return this.set(path, value);
    }
    push(path, value) {
        return this.set(path, value);
    }
    pull(path, defaultValue) {
        return RequestDataWriter_1.RequestDataWriter.prototype.pull.apply(this, arguments);
    }
    delete(path) {
        return RequestDataWriter_1.RequestDataWriter.prototype.delete.apply(this, arguments);
    }
    remove(path) {
        return this.delete(path);
    }
    forget(path) {
        return this.delete(path);
    }
    flush() {
        return this.clear();
    }
}
exports.Session = Session;
najs_binding_1.register(Session);
